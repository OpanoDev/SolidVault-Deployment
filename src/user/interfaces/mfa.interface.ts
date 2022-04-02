export interface SetMfa {
  readonly status?: string;
  readonly qr?: string;
  readonly secret_32?: string;
  readonly secret_link?: string;
  readonly code?: string;
}
