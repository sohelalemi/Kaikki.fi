# Kaikki.fi mobile release checklist

## Core flows
- [ ] Sign up, email confirmation and sign in
- [ ] Sign out and session restore
- [ ] Edit profile and avatar
- [ ] Create listing with title, price, category, city, description and photos
- [ ] Open listing details
- [ ] Edit own listing
- [ ] Add/remove favorite
- [ ] Search and filter listings
- [ ] Map/list switch and exact listing location
- [ ] Send and receive messages with two accounts
- [ ] Mark messages/notifications read
- [ ] Create reservation, accept/reject/cancel reservation

## Device permissions
- [ ] Photo library permission text is correct
- [ ] Location permission text is correct
- [ ] Notification permission works on development/production build

## Security and data
- [ ] RLS blocks access to other users' private messages, favorites and reservations
- [ ] Storage upload paths are user-scoped
- [ ] No service-role key or private Apple/Expo credential is committed
- [ ] Required EXPO_PUBLIC_* variables exist in EAS environments

## iOS release
- [ ] `npm run doctor` passes
- [ ] `npm run check` exports the iOS bundle
- [ ] App icon and splash assets are final
- [ ] Version and iOS buildNumber are incremented
- [ ] Production EAS build succeeds
- [ ] TestFlight smoke test passes on a physical iPhone
- [ ] App Store privacy, support URL, screenshots and legal links are ready
