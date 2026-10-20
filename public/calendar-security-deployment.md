# Instrukcja Wdrożenia Integracji Google Calendar & Supabase dla Slow Skin Concept

## 1. Zestawienie Zmiennych Środowiskowych

### A. Zmienne Wymagane
| Zmienna | Opis i Rola | Wartość dla instancji |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | Identyfikator klienta OAuth 2.0 (Google Cloud Console) | `282678771576-j8q7sbli679o2jkgi2cg5pq9032ikrf4.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Sekret klienta powiązany z Client ID | Wartość z panelu Google Cloud Console -> Credentials |
| `GOOGLE_REDIRECT_URI` | Dokładny adres zwrotny zarejestrowany w Google Cloud | Zależny od środowiska (patrz sekcja 2 poniżej) |
| `TOKEN_ENCRYPTION_KEY` | Dedykowany klucz szyfrowania tokenów AES-256-GCM | Osobny losowy ciąg (min. 32 znaki lub 64 znaki hex). Całkowicie niezależny od sekretu Google |
| `ADMIN_PIN` | Kod PIN personelu do panelu gabinetu | Ustalony przez gabinet (np. `2026`). Jedyna zmienna wymagana do autoryzacji personelu |
| `SUPABASE_URL` | Adres URL prywatnego projektu Supabase gabinetu | `https://[projekt-slow-skin].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Klucz backendu `service_role` (omija RLS) | Prywatny klucz z Supabase -> Settings -> API |

### B. Zmienne Opcjonalne
| Zmienna | Domyślne zachowanie, gdy brak |
| :--- | :--- |
| `GOOGLE_CALENDAR_ID` | Automatycznie używa zweryfikowanego kalendarza gabinetu: `ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com` |
| `ADMIN_JWT_SECRET` / `ADMIN_SECRET` | Jeśli brak, backend automatycznie wyprowadza podpis HMAC sesji administratora z `ADMIN_PIN` (ze solą kryptograficzną). Nie trzeba konfigurować obu |
| `TOKEN_ENCRYPTION_KEY_FALLBACK` | Opcjonalny klucz przejściowy używany do automatycznego odszyfrowania i re-enkrypcji tokenów zapisanych starym kluczem |
| `GOOGLE_REFRESH_TOKEN` | **Nie blokuje startu**: Token powstaje w procesie autoryzacji OAuth przez `slowskinconcept@gmail.com` i jest automatycznie zapisywany w Supabase. Zmienna służy wyłącznie jako awaryjny override bez bazy |

### C. Zmienne Zbędne (Wykluczone)
- `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`: Frontend nie łączy się bezpośrednio z bazą. Wszystkie operacje realizuje backend Express. Brak prefiksów `VITE_` chroni poświadczenia przed ujawnieniem w przeglądarce.

---

## 2. Adresy Zwrotne (GOOGLE_REDIRECT_URI) dla poszczególnych środowisk

W Google Cloud Console (APIs & Services -> Credentials -> Twój OAuth 2.0 Client ID -> Authorized redirect URIs) dodaj adresy:

1. **AI Studio (Bieżące środowisko Development)**:
   ```text
   https://ais-dev-txeazxhchkgmpieykyn2r4-361970093951.europe-west3.run.app/api/calendar/auth/callback
   ```
2. **AI Studio (Shared Preview)**:
   ```text
   https://ais-pre-txeazxhchkgmpieykyn2r4-361970093951.europe-west3.run.app/api/calendar/auth/callback
   ```
3. **Środowisko lokalne**:
   ```text
   http://localhost:3000/api/calendar/auth/callback
   ```
4. **Produkcja Vercel (slow-skin-concept.pl)**:
   ```text
   https://slow-skin-concept.pl/api/calendar/auth/callback
   ```

---

## 3. Bezpośrednie pobranie plików (Działające linki HTTP)

Pliki są udostępnione bezpośrednio z serwera aplikacji pod adresami:

- **Patch do repozytorium git**:  
  `https://ais-dev-txeazxhchkgmpieykyn2r4-361970093951.europe-west3.run.app/calendar-security.patch`  
  (lub lokalnie: `http://localhost:3000/calendar-security.patch`)

- **Niniejszy dokument wdrożenia**:  
  `https://ais-dev-txeazxhchkgmpieykyn2r4-361970093951.europe-west3.run.app/calendar-security-deployment.md`  
  (lub lokalnie: `http://localhost:3000/calendar-security-deployment.md`)

Oraz w panelu środowiska AI Studio w folderze:
`/.aistudio/artifacts/brain/17ca846b-cd34-421b-913e-39c2b815a820/`

---

## 4. Wykonanie migracji w Supabase

W panelu Supabase (dla projektu gabinetu Slow Skin):
1. Przejdź do **SQL Editor -> New query**.
2. Wklej zawartość pliku:
   `supabase/migrations/20261014110000_slowskin_google_oauth_booking.sql`
3. Kliknij **Run**.
4. Migracja:
   - Utworzy tabele `slowskin_google_oauth_tokens`, `slowskin_oauth_states` i `slowskin_bookings`.
   - Nałoży RLS i REVOKE dla anon i authenticated (wyłącznie na tabele `slowskin_*`).
   - Nada uprawnienia `EXECUTE` dla funkcji RPC `consume_slowskin_oauth_state` wyłącznie roli `service_role`.
   - Zarejestruje regułę `EXCLUDE USING gist` (btree_gist) blokującą nakładające się przedziały zabiegów wraz z 15-minutowym buforem na poziomie silnika PostgreSQL.

---

## 5. Jak autoryzować Google Calendar jako personel gabinetu

1. Ustaw wymagane zmienne w panelu środowiska (`GOOGLE_CLIENT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PIN`, `TOKEN_ENCRYPTION_KEY`).
2. Otwórz panel personelu gabinetu:
   `https://ais-dev-txeazxhchkgmpieykyn2r4-361970093951.europe-west3.run.app/?admin=true`
3. Wprowadź skonfigurowany `ADMIN_PIN` (system chroni przed brute-force: max 5 prób, potem 15 min blokady).
4. Kliknij przycisk **„Połącz Google Calendar”** (wywołuje endpoint `GET /api/calendar/auth/login`).
5. Zaloguj się kontem **slowskinconcept@gmail.com** i zaakceptuj uprawnienia do Kalendarza Google.
6. Callback odbierze i zweryfikuje `state` (PKCE S256), pobierze refresh token, zaszyfruje go kluczem `TOKEN_ENCRYPTION_KEY` i trwale zapisze w Supabase.
