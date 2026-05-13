/**
 * Barrel — exporta todas las plantillas de email.
 */
export { emailLayout, ctaButton, esc, infoTable, noteCard, TOKENS } from "./_layout";
export type { EmailLayoutOptions } from "./_layout";
export { welcomeEmail } from "./welcome";
export type { WelcomeEmailOpts } from "./welcome";
export { orderConfirmationEmail } from "./orderConfirmation";
export type { OrderConfirmationOpts } from "./orderConfirmation";
export { orderStatusEmail } from "./orderStatus";
export type { OrderStatusEmailOpts } from "./orderStatus";
export { contactNotificationEmail } from "./contact";
export type { ContactEmailOpts } from "./contact";
export { passwordChangedEmail } from "./passwordChanged";
export type { PasswordChangedOpts } from "./passwordChanged";
