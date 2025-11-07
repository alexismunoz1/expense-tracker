import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createUserProfile } from "@/utils/user-profile";
import { z } from "zod";

const onboardingSchema = z.object({
  currency: z.enum(['USD', 'ARS']),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await req.json();
    const validation = onboardingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Request inválido", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { currency } = validation.data;

    // Create user profile
    const profile = await createUserProfile(user.id, currency);

    if (!profile) {
      return NextResponse.json(
        { error: "Error al crear el perfil de usuario" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error en /api/onboarding:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
