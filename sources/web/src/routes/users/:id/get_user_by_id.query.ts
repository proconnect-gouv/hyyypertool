import { GetUserById } from "#src/queries/users";

export const get_user_by_id = GetUserById({
  columns: {
    created_at: true,
    email_verified: true,
    email: true,
    family_name: true,
    given_name: true,
    id: true,
    job: true,
    last_sign_in_at: true,
    phone_number: true,
    reset_password_sent_at: true,
    sign_in_count: true,
    updated_at: true,
    verify_email_sent_at: true,
    totp_key_verified_at: true,
    force_2fa: true,
  },
});
