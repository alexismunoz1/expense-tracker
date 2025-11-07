import 'server-only'
import { createClient } from '@/lib/supabase/server';
import { UserProfile, CurrencyCode } from '@/types/expense';

/**
 * Get user profile from database
 * @param userId - The user's ID
 * @returns User profile or null if not found
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('❌ Unexpected error in getUserProfile:', error);
    return null;
  }
}

/**
 * Create a new user profile
 * @param userId - The user's ID
 * @param preferredCurrency - The user's preferred currency
 * @returns The created user profile or null on error
 */
export async function createUserProfile(
  userId: string,
  preferredCurrency: CurrencyCode = 'USD'
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();

    const newProfile = {
      user_id: userId,
      preferred_currency: preferredCurrency,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user profile:', error);
      return null;
    }

    console.log('✅ User profile created:', data);
    return data as UserProfile;
  } catch (error) {
    console.error('❌ Unexpected error in createUserProfile:', error);
    return null;
  }
}

/**
 * Update user's preferred currency
 * @param userId - The user's ID
 * @param preferredCurrency - The new preferred currency
 * @returns Updated profile or null on error
 */
export async function updateUserCurrency(
  userId: string,
  preferredCurrency: CurrencyCode
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        preferred_currency: preferredCurrency,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating user currency:', error);
      return null;
    }

    console.log('✅ User currency updated:', data);
    return data as UserProfile;
  } catch (error) {
    console.error('❌ Unexpected error in updateUserCurrency:', error);
    return null;
  }
}

/**
 * Get or create user profile (helper function)
 * If profile doesn't exist, creates one with default currency
 * @param userId - The user's ID
 * @param defaultCurrency - Default currency if creating new profile
 * @returns User profile (existing or newly created)
 */
export async function getOrCreateUserProfile(
  userId: string,
  defaultCurrency: CurrencyCode = 'USD'
): Promise<UserProfile | null> {
  // Try to get existing profile
  let profile = await getUserProfile(userId);

  // If doesn't exist, create one
  if (!profile) {
    console.log('📝 No profile found, creating new one with currency:', defaultCurrency);
    profile = await createUserProfile(userId, defaultCurrency);
  }

  return profile;
}

/**
 * Check if user has completed onboarding (has a profile)
 * @param userId - The user's ID
 * @returns true if profile exists, false otherwise
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile !== null;
}
