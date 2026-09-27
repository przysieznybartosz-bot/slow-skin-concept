import { Treatment, MagazineArticle, Review } from "./types";

export const TREATMENTS: Treatment[] = [
  {
    id: "videokonsultacja",
    title: "Videokonsultacja Bionomiczna",
    subtitle: "Konsultacja kosmetologiczna online 1:1 • Diagnoza barierowa, wywiad bionomiczny i autorski Beauty Plan™",
    duration: "60 minut",
    price: "250 PLN",
    description: "Dedykowana videokonsultacja online prowadzona w standardzie Slow Skin Concept™ przez mgr Katarzynę Brzezińską. Idealne rozwiązanie dla osób z całej Polski i zza granicy, które nie mogą dotrzeć do gabinetu w Jelczu-Laskowicach, a pragną skonsultować trądzik dorosłych, trądzik różowaty, nadwrażliwość barierową, przewlekły rumień lub ułożyć bezpieczną, bionomiczną pielęgnację domową. Podczas 60-minutowego spotkania wideo przez Google Meet dokładnie analizujemy historię skóry, dotychczasowe kosmetyki, nawyki i dietę, a po spotkaniu otrzymujesz szczegółowy, spersonalizowany Beauty Plan™ (PDF) z dokładnymi zaleceniami rano/wieczór oraz wskazówkami regeneracyjnymi.",
    focus: "Diagnoza barierowa online, analiza nawyków i składów kosmetyków, ułożenie autorskiego planu pielęgnacji bionomicznej (PDF), bezpieczne połączenie wideo przez Google Meet",
    image: "/src/assets/images/regenerated_image_1781694292749.jpg",
    indications: [
      "Osoby spoza Wrocławia / z zagranicy poszukujące rzetelnej diagnozy kosmetologicznej i wsparcia bionomicznego",
      "Nawracający trądzik dorosłych, trądzik różowaty, skóra naczyniowa, przewlekły rumień i nadreaktywność",
      "Uszkodzona bariera hydrolipidowa (ściągnięcie, pieczenie, reaktywność na kosmetyki)",
      "Chaos pielęgnacyjny i potrzeba ułożenia minimalistycznego, fizjologicznego Beauty Planu opartego na biozgodnych składnikach",
      "Przygotowanie skóry do planowanych zabiegów gabinetowych lub kontrola postępów dotychczasowej terapii domowej"
    ],
    contraindications: [
      "Brak przeciwwskazań — konsultacja ma charakter merytoryczno-diagnostyczny i odbywa się w bezpiecznej, komfortowej formule online"
    ],
    postTreatmentCare: [
      "Wdrożenie otrzymanego autorskiego Beauty Planu™ krok po kroku (faza wyciszenia i odbudowy płaszcza lipidowego)",
      "Wyeliminowanie drażniących substancji zapachowych, wysuszających alkoholi i agresywnych peelingów ziarnistych",
      "Możliwość kontaktu mailowego i kontroli efektów po 4-6 tygodniach stosowania zaleceń"
    ],
    activeSubstances: [
      "Fizjologiczne lipidy biomimetyczne (ceramidy NP/AP/EOP, cholesterol, fitosfingozyna)",
      "Ektoina farmaceutyczna 100% (ochrona osi nerwowo-skórnej i stabilizacja białek komórkowych)",
      "Prebiotyki i postbiotyki normalizujące mikrobiom naskórkowy",
      "Kwas bursztynowy, cynk PCA oraz antyoksydanty nowej generacji (C60, oryzanol)"
    ],
    protocolSteps: [
      { phase: "I — Przygotowanie & Kwestionariusz Bionomiczny", description: "Wypełnienie wywiadu zdrowotno-kosmetycznego i przesłanie zdjęć skóry w świetle dziennym przed połączeniem." },
      { phase: "II — Połączenie Wideo Google Meet (60 min)", description: "Szczegółowa rozmowa z mgr Katarzyną Brzezińską: analiza objawów, audyt używanych preparatów i ocena barierowości." },
      { phase: "III — Opracowanie Spersonalizowanego Beauty Planu™", description: "Dobór celowanych substancji biozgodnych, harmonogram pielęgnacji rano/wieczór oraz wskazówki dietetyczno-lifestyle'owe." },
      { phase: "IV — Przesłanie Raportu PDF & Wsparcie", description: "Otrzymanie kompletnego dokumentu z zaleceniami na e-mail wraz z dedykowanymi rekomendacjami zakupowymi." }
    ],
    faq: [
      {
        question: "Jak wygląda połączenie na Videokonsultację?",
        answer: "Po rezerwacji terminu w naszym kalendarzu otrzymujesz bezpośredni link do pokoju Google Meet na swój adres e-mail oraz zaproszenie w Google Calendar. W wyznaczonym czasie wystarczy kliknąć link (na telefonie lub komputerze z kamerą i mikrofonem).",
        category: "Techniczne"
      },
      {
        question: "Jak przygotować się do Videokonsultacji?",
        answer: "Przed spotkaniem warto zmyć makijaż min. 1-2 godziny wcześniej, zadbać o dobre, naturalne oświetlenie twarzy (najlepiej naprzeciwko okna) oraz przygotować listę lub zdjęcia obecnie stosowanych kosmetyków.",
        category: "Przygotowanie"
      },
      {
        question: "Co otrzymuję po Videokonsultacji?",
        answer: "W ciągu 48 godzin od spotkania otrzymujesz autorski dokument Beauty Plan™ (plik PDF) zawierający spersonalizowany harmonogram pielęgnacji porannej i wieczornej, listę rekomendowanych produktów z fizjologicznymi składami oraz zalecenia holistyczne.",
        category: "Efekty"
      },
      {
        question: "Ile kosztuje Videokonsultacja i jak dokonać opłaty?",
        answer: "Koszt pełnej, 60-minutowej Videokonsultacji wraz z indywidualnym Beauty Planem wynosi 250 PLN. Szczegóły dotyczące płatności (BLIK / przelew / karta) otrzymasz wraz z potwierdzeniem rezerwacji.",
        category: "Płatności"
      }
    ]
  },
  {
    id: "skin-readiness",
    title: "SKIN READINESS™ • PIERWSZA WIZYTA",
    subtitle: "Biologiczny Reset Skóry — Diagnoza, fizjologiczne oczyszczenie i przygotowanie skóry do dalszych etapów terapii",
    duration: "120 minut",
    price: "400 PLN — 600 PLN",
    description: "„Pierwsza wizyta nie rozpoczyna się od wyboru zabiegu. Rozpoczyna się od zrozumienia skóry.” Biologiczny Reset Skóry to pierwsza, pogłębiona wizyta w Slow Skin Concept™. Łączy diagnozę aktualnej kondycji skóry z indywidualnie dobranym zabiegiem oczyszczającym i przygotowującym ją do dalszych działań. Celem wizyty jest rozpoznanie biologicznego punktu wyjścia: kondycji bariery naskórkowej, poziomu nawodnienia, reaktywności, sposobu rogowacenia, aktywności gruczołów łojowych, pigmentacji oraz tolerancji dotychczasowej pielęgnacji i wcześniejszych zabiegów. Reset nie oznacza intensywnego złuszczania — oznacza uporządkowanie skóry i przygotowanie jej do tego, czego rzeczywiście potrzebuje.",
    focus: "Diagnoza biologiczna, fizjologiczne oczyszczenie, regeneracja bariery naskórkowej, określenie biologicznego punktu wyjścia",
    image: "/src/assets/images/skin_readiness_diag_1790249295522.jpg",
    indications: [
      "Rozpoczynanie terapii w Slow Skin Concept™",
      "Brak pewności, jakiego zabiegu aktualnie potrzebuje skóra",
      "Stosowanie wielu kosmetyków bez widocznej lub trwałej poprawy",
      "Uczucie suchości, ściągnięcia, pieczenia lub nadmiernej reaktywności",
      "Nierówna powierzchnia, nadmierne rogowacenie albo skłonność do niedoskonałości",
      "Przebyte zbyt intensywne zabiegi lub pielęgnacja, które osłabiły komfort cery",
      "Potrzeba spójnego, bezpiecznego planu dalszego postępowania zabiegowego i domowego"
    ],
    contraindications: [
      "Brak bezwzględnych przeciwwskazań — zakres zabiegu jest w pełni indywidualnie dopasowywany po ocenie biologicznej gotowości skóry"
    ],
    postTreatmentCare: [
      "Stosowanie zaleconej, łagodnej pielęgnacji wspierającej barierę naskórkową",
      "Czasowe odstawienie przypadkowych produktów i agresywnych peelingów",
      "Codzienna ochrona przeciwsłoneczna dopasowana do tolerancji cery",
      "Wdrożenie wskazówek z indywidualnego planu pielęgnacji domowej (Beauty Plan™)"
    ],
    activeSubstances: [
      "Indywidualnie dobrane bazy DMS i koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Ciekłokrystaliczne ceramidy (NP, AP, EOP), fitosfingozyna i fosfolipidy",
      "Ektoina czysta i prebiotyki wspierające mikrobiom naskórkowy",
      "Fizjologiczne substancje kojące i regulujące równowagę wodno-lipidową"
    ],
    protocolSteps: [
      { phase: "1. Rozmowa i wywiad", description: "Analizowane są dotychczasowa pielęgnacja, wcześniejsze zabiegi, reakcje skóry, styl życia oraz czynniki, które mogą wpływać na jej aktualną kondycję." },
      { phase: "2. Diagnoza biologiczna skóry", description: "Oceniane są najważniejsze parametry i widoczne cechy skóry. Określany jest jej aktualny priorytet oraz gotowość do kolejnych działań." },
      { phase: "3. Indywidualnie dobrany reset zabiegowy", description: "Sposób oczyszczania, intensywność działania i zastosowane metody dobierane są do kondycji skóry. Zabieg może obejmować łagodne oczyszczanie, fizjologiczne złuszczanie, wsparcie nawodnienia, ukojenie lub pielęgnację bariery." },
      { phase: "4. Kierunek dalszej terapii", description: "Na podstawie odpowiedzi skóry określany jest kolejny etap Biologicznej Spirali Inteligencji Skóry™. Ustalane są również podstawowe zalecenia pielęgnacji domowej." }
    ],
    faq: [
      {
        question: "Czym jest Biologiczny Reset Skóry i czy oznacza agresywne złuszczanie?",
        answer: "Reset nie oznacza intensywnego złuszczania ani agresywnego peelingu kwasowego. Oznacza fizjologiczne uporządkowanie skóry i przygotowanie jej do tego, czego rzeczywiście potrzebuje w kolejnym etapie. Nie ma jednego identycznego przebiegu — zakres jest ustalany na bieżąco podczas wizyty.",
        category: "Koncepcja"
      },
      {
        question: "Czym różni się wariant Standard od Premium pierwszej wizyty?",
        answer: "Pakiet Standard (400 PLN) opiera się na wywiadzie bionomicznym, kosmetologicznej ocenie palpacyjno-wizualnej i resecie zabiegowym. Pakiet Premium (600 PLN) obejmuje dodatkowo wielospektralny audyt czujnikami komputerowymi Thessia Skin Scanner / Nati V3 / Iomet wraz z rozszerzonym Beauty Planem™.",
        category: "Warianty"
      },
      {
        question: "Dlaczego na pierwszej wizycie nie wybiera się od razu konkretnej procedury aparaturowej?",
        answer: "W Slow Skin Concept™ technologia nie jest punktem wyjścia. Zanim zastosujemy jakąkolwiek silniejszą procedurę stymulującą, musimy dokładnie poznać barierę, reaktywność i zdolności regeneracyjne skóry, aby bodziec przyniósł oczekiwany, trwały rezultat bez powikłań.",
        category: "Bezpieczeństwo"
      }
    ]
  },
  {
    id: "acne-balance-therapy",
    title: "Acne Balance Therapy™",
    subtitle: "Spersonalizowana terapia dla skóry z niedoskonałościami, zaskórnikami i zaburzoną równowagą sebum",
    duration: "75–90 minut",
    price: "350 PLN — 450 PLN, zależnie od zakresu zabiegu",
    description: "Acne Balance Therapy™ to indywidualnie komponowany zabieg dla skóry skłonnej do zaskórników, grudek, krostek, nadmiernego wydzielania sebum i nawracających niedoskonałości. Terapia nie opiera się na intensywnym przesuszaniu ani jednym protokole oczyszczającym. Jej przebieg wynika z diagnozy biologicznej obejmującej stan bariery, sposób rogowacenia, charakter zmian, poziom reaktywności oraz tolerancję dotychczasowej pielęgnacji. Celem zabiegu jest łagodne oczyszczenie, wsparcie prawidłowego procesu rogowacenia, pielęgnacja skóry łojotokowej oraz stworzenie warunków sprzyjających równowadze bariery i mikrobiomu. W przypadku zdiagnozowanego trądziku zabieg może stanowić element wspierającej pielęgnacji kosmetologicznej, prowadzonej z uwzględnieniem zaleceń dermatologa.",
    focus: "Kierunek działania: OCZYSZCZENIE • SEBUM • ROGOWACENIE • MIKROBIOM • Poszanowanie bariery ochronnej",
    image: "/src/assets/images/acne_balance_1790249354155.jpg",
    indications: [
      "Tendencja do zaskórników otwartych i zamkniętych",
      "Nadmierne przetłuszczanie się skóry (łojotok)",
      "Skłonność do grudek, krostek i nawracających niedoskonałości",
      "Nierówna, szorstka powierzchnia naskórka",
      "Skóra jednocześnie przetłuszczająca się i odwodniona",
      "Zła tolerancja agresywnych kuracji przeciwtrądzikowych",
      "Przesuszenie lub nadmierna reaktywność na skutek zbyt agresywnej pielęgnacji",
      "Potrzeba uporządkowania codziennej pielęgnacji domowej"
    ],
    contraindications: [
      "Aktywna infekcja bakteryjna lub wirusowa skóry (opryszczka w fazie aktywnej)",
      "Przerwanie ciągłości naskórka i świeże rany",
      "Ostre zaostrzenie zmian wymagające natychmiastowej konsultacji lekarskiej",
      "Alergia na składniki planowanych preparatów",
      "Przeciwwskazania właściwe dla ewentualnie dobranej technologii aparaturowej"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnego oczyszczania bez intensywnego odtłuszczania skóry",
      "Używanie indywidualnie dobranej pielęgnacji domowej",
      "Czasowe odstawienie dodatkowych peelingów, retinoidów i silnie działających kwasów",
      "Unikanie mechanicznego usuwania i wyciskania zmian",
      "Codzienna ochrona przeciwsłoneczna dopasowana do tolerancji skóry",
      "Obserwowanie reakcji skóry i stosowanie otrzymanych zaleceń"
    ],
    activeSubstances: [
      "Baza bionomiczna oraz koncentraty aktywne dermaviduals® dobierane przy klientce",
      "Substancje seboregulujące i wspierające prawidłowe rogowacenie (m.in. cynk PCA, fitosterole)",
      "Fizjologiczne składniki nawadniające bez obciążania naskórka",
      "Kompleksy wspierające równowagę mikrobiomu i ochronę antyoksydacyjną"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza biologiczna", description: "Oceniane są charakter zmian, wydzielanie sebum, sposób rogowacenia, nawodnienie, reaktywność i stan bariery. Analizowana jest również dotychczasowa pielęgnacja." },
      { phase: "2. Oczyszczanie i przygotowanie naskórka", description: "Rodzaj oczyszczania i złuszczania dobierany jest do kondycji skóry. Celem jest usunięcie nadmiaru sebum i zrogowaciałych komórek bez intensywnego odtłuszczania oraz naruszania bariery." },
      { phase: "3. Spersonalizowana faza aktywna", description: "Przy klientce komponowany jest koktajl z odpowiedniej bazy i koncentratów aktywnych dermaviduals®. W zależności od gotowości skóry dobierana jest także metoda jego zastosowania." },
      { phase: "4. Wyciszenie i ochrona", description: "Końcowy etap wspiera nawodnienie, komfort i barierę naskórkową. Zabieg może zostać uzupełniony metodą aparaturową dobraną do rodzaju zmian i reaktywności skóry." }
    ],
    faq: [
      {
        question: "Dlaczego Acne Balance Therapy™ nie przesusza skóry agresywnymi spirytusami czy mocnymi kwasami?",
        answer: "Skóra z niedoskonałościami nie zawsze potrzebuje silniejszego oczyszczania. Agresywne przesuszanie uszkadza barierę naskórkową, co prowadzi do łojotoku reaktywnego i nasilenia stanów zapalnych. W Slow Skin Concept™ przywracamy równowagę mikrobiomu i fizjologiczne złuszczanie przy pełnym poszanowaniu bariery.",
        category: "Zasada terapii"
      }
    ]
  },
  {
    id: "adult-acne-therapy",
    title: "Acne Balance 25+ Therapy™",
    subtitle: "Spersonalizowana terapia niedoskonałości skóry dorosłej",
    duration: "80–90 minut",
    price: "380 PLN — 480 PLN, zależnie od zakresu zabiegu",
    description: "Acne Balance 25+ Therapy™ została stworzona dla skóry dorosłej, w której zaskórniki, grudki, krostki i nadmierne wydzielanie sebum mogą współistnieć z odwodnieniem, reaktywnością, przebarwieniami oraz pierwszymi oznakami starzenia. Skóra po 25. roku życia wymaga innego podejścia niż skóra nastoletnia — intensywne przesuszanie osłabia barierę oraz zmniejsza tolerancję pielęgnacji. Dlatego terapia łączy działania ukierunkowane na niedoskonałości z jednoczesnym wsparciem nawodnienia, bariery i procesów regeneracyjnych. Przebieg zabiegu wynika z diagnozy biologicznej i uwzględnia stres, zmiany hormonalne, styl życia i dotychczasową pielęgnację.",
    focus: "Kierunek działania: NIEDOSKONAŁOŚCI • BARIERA • SEBUM • PRZEBARWIENIA • Terapia skóry dorosłej 25+",
    image: "/src/assets/images/acne_balance_1790249354155.jpg",
    indications: [
      "Niedoskonałości pojawiające się lub utrzymujące po 25. roku życia",
      "Grudki, krostki i zaskórniki, szczególnie w dolnej części twarzy (strefa żuchwy i brody)",
      "Okresowe pogorszenie kondycji skóry związane ze stresem lub cyklem hormonalnym",
      "Nadmierne wydzielanie sebum połączone z odwodnieniem",
      "Reaktywność i osłabiona tolerancja tradycyjnych kosmetyków przeciwtrądzikowych",
      "Przebarwienia i ślady pozostające po niedoskonałościach (plamy pozapalne PIH)",
      "Pierwsze oznaki starzenia współistniejące ze zmianami trądzikowymi",
      "Potrzeba połączenia pielęgnacji niedoskonałości z działaniem regeneracyjnym"
    ],
    contraindications: [
      "Aktywne infekcje skóry i opryszczka w fazie aktywnej",
      "Otwarte rany i przerwanie ciągłości naskórka",
      "Ostre zaostrzenie zmian wymagające konsultacji lekarskiej",
      "Alergia na składniki planowanych preparatów",
      "Ciąża i okres karmienia piersią w przypadku wybranych metod lub substancji",
      "Przeciwwskazania właściwe dla wybranej technologii aparaturowej"
    ],
    postTreatmentCare: [
      "Łagodne oczyszczanie bez intensywnego odtłuszczania",
      "Indywidualnie dobrane składniki aktywne zalecone w Beauty Planie",
      "Nawilżenie i codzienna pielęgnacja bariery lipidowej",
      "Czasowe ograniczenie dodatkowych peelingów i silnie działających kuracji",
      "Codzienna fotoprotekcja dopasowana do tolerancji skóry",
      "Obserwacja reakcji skóry i modyfikowanie zaleceń wraz ze zmianą jej kondycji"
    ],
    activeSubstances: [
      "Baza DMS oraz koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Substancje seboregulujące i wspierające prawidłowe rogowacenie",
      "Składniki nawadniające i odbudowujące barierę naskórkową",
      "Prekursory antyoksydacyjne zmniejszające widoczność przebarwień i wspierające odnowę"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza biologiczna", description: "Oceniane są rodzaj i umiejscowienie zmian, wydzielanie sebum, sposób rogowacenia, nawodnienie, reaktywność, stan bariery i obecność przebarwień. Uwzględniana jest dotychczasowa pielęgnacja oraz wpływ stresu i hormonów." },
      { phase: "2. Oczyszczanie i przygotowanie skóry", description: "Sposób oczyszczania i ewentualnego złuszczania dobierany jest do aktualnej kondycji skóry bez nadmiernego odtłuszczania i osłabiania bariery." },
      { phase: "3. Spersonalizowany koktajl zabiegowy", description: "Przy klientce komponowany jest koktajl z odpowiedniej bazy i koncentratów aktywnych dermaviduals®, odpowiadający dominującym problemom oraz potrzebom regeneracyjnym." },
      { phase: "4. Indywidualnie dobrana metoda działania", description: "W zależności od biologicznej gotowości skóry zabieg może zostać uzupełniony odpowiednio dobraną technologią aparaturową o ściśle kontrolowanej głębokości i intensywności." }
    ],
    faq: [
      {
        question: "Dlaczego skóra dorosła z niedoskonałościami nie powinna stosować pielęgnacji dla nastolatków?",
        answer: "Skóra po 25. roku życia ma cieńszy naskórek, wolniejszy metabolizm odnowy i łatwiej ulega odwodnieniu. Kosmetyki dla nastolatków oparte na silnych alkoholach i agresywnym złuszczaniu niszczą cement międzykomórkowy dorosłej skóry, potęgując zmarszczki i wywołując stany zapalne z podrażnienia.",
        category: "Fizjologia"
      }
    ]
  },
  {
    id: "rosacea-calm-therapy",
    title: "Rosacea Calm Therapy™",
    subtitle: "Spersonalizowany zabieg dla skóry z rumieniem, nadreaktywnością i osłabioną barierą",
    duration: "75–90 minut",
    price: "380 PLN — 480 PLN",
    description: "Rosacea Calm Therapy™ to indywidualnie komponowany zabieg przeznaczony dla skóry skłonnej do zaczerwienienia, pieczenia, uczucia gorąca i nadmiernej reaktywności. Łączy delikatne postępowanie z zastosowaniem substancji biologicznie aktywnych dobranych do aktualnego problemu, kondycji bariery i tolerancji skóry. Celem zabiegu jest poprawa komfortu, zwiększenie nawodnienia, wsparcie architektury lipidowej oraz pielęgnacja skóry naczyniowej i wrażliwej. Rosacea Calm Therapy™ nie jest jednym, gotowym protokołem. Dwie skóry z podobnym rumieniem mogą potrzebować innego rodzaju wsparcia, ponieważ różnią się stanem bariery, poziomem nawodnienia, reaktywnością i tolerancją składników aktywnych.",
    focus: "Kierunek działania: UKOJENIE • BARIERA • NAWODNIENIE • Wyciszenie rumienia i pieczenia, wsparcie mikrośrodowiska",
    image: "/src/assets/images/rosacea_calm_1790249310213.jpg",
    indications: [
      "Skóra łatwo i często się czerwieni",
      "Reaguje na zmiany temperatury, stres, emocje lub pielęgnację",
      "Odczuwa pieczenie, ściągnięcie albo przejściowe uczucie gorąca",
      "Źle toleruje wiele kosmetyków i składników aktywnych",
      "Jest przesuszona, nadmiernie reaktywna lub ma osłabioną barierę",
      "Potrzebuje wyciszenia po zbyt intensywnej pielęgnacji albo wcześniejszych zabiegach",
      "Wykazuje cechy skóry naczyniowej lub ma rozpoznany przez lekarza trądzik różowaty"
    ],
    contraindications: [
      "Aktywna infekcja lub naruszenie ciągłości skóry",
      "Opryszczka w fazie aktywnej",
      "Świeże oparzenia słoneczne lub termiczne",
      "Ostre zaostrzenie zmian wymagające konsultacji lekarskiej",
      "Alergia na składniki planowanych preparatów",
      "Przeciwwskazania wynikające z zastosowania wybranej technologii aparaturowej"
    ],
    postTreatmentCare: [
      "Łagodne oczyszczanie i stosowanie zaleconej pielęgnacji barierowej",
      "Czasowe odstawienie peelingów, retinoidów i intensywnie działających kwasów",
      "Unikanie gorącej wody, sauny i innych czynników nasilających rumień",
      "Codzienna ochrona przeciwsłoneczna dopasowana do tolerancji skóry",
      "Obserwowanie reakcji skóry i stosowanie otrzymanych zaleceń"
    ],
    activeSubstances: [
      "Baza bionomiczna DMS oraz koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Substancje wspierające ukojenie i ograniczenie uczucia dyskomfortu",
      "Składniki odbudowujące architekturę lipidową i zatrzymujące wodę w naskórku",
      "Kompleksy antyoksydacyjne i bioflawonoidy chroniące naczynia krwionośne"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza biologiczna", description: "Oceniane są reaktywność, widoczne zaczerwienienie, nawodnienie, komfort i stan bariery. Analizowane są również czynniki, które mogą nasilać reakcje skóry." },
      { phase: "2. Delikatne oczyszczanie", description: "Sposób oczyszczania dobierany jest do aktualnej tolerancji skóry. Celem jest przygotowanie jej do kolejnych etapów bez intensywnego tarcia i nadmiernego odtłuszczania." },
      { phase: "3. Spersonalizowany koktajl zabiegowy", description: "Bezpośrednio przy klientce komponowany jest koktajl z bazy i koncentratów aktywnych dermaviduals®. Jego skład odpowiada aktualnym potrzebom i biologicznym priorytetom skóry." },
      { phase: "4. Wyciszenie i ochrona", description: "Końcowy etap wspiera komfort, nawodnienie i barierę naskórkową. W zależności od gotowości skóry zabieg może zostać uzupełniony odpowiednio dobraną metodą aparaturową lub pielęgnacją ochronną." }
    ],
    faq: [
      {
        question: "Czy Rosacea Calm Therapy™ może być stosowana przy zdiagnozowanym trądziku różowatym?",
        answer: "Tak. W przypadku zdiagnozowanego trądziku różowatego zabieg może stanowić element pielęgnacji wspierającej, prowadzonej z uwzględnieniem zaleceń dermatologa. Działa wybitnie kojąco, wzmacnia barierę i zmniejsza uczucie pieczenia.",
        category: "Kwalifikacja"
      }
    ]
  },
  {
    id: "couperose-therapy",
    title: "Couperose Therapy™",
    subtitle: "Spersonalizowana terapia skóry naczyniowej, reaktywnej i skłonnej do zaczerwienienia",
    duration: "60–75 minut",
    price: "350 PLN — 500 PLN, zależnie od zakresu zabiegu",
    description: "Couperose Therapy™ to indywidualnie komponowany zabieg dla skóry z widocznymi naczynkami, okresowym lub utrwalonym zaczerwienieniem oraz tendencją do nadmiernej reaktywności. Terapia łączy delikatne postępowanie z zastosowaniem substancji biologicznie aktywnych dobranych do aktualnej kondycji skóry. Jej celem jest poprawa komfortu, ochrona antyoksydacyjna, wsparcie bariery naskórkowej oraz pielęgnacja skóry naczyniowej bez jej nadmiernego rozgrzewania i przeciążania. Widoczne zaczerwienienie może współistnieć z odwodnieniem i osłabioną barierą, dlatego przebieg zabiegu wynika z diagnozy biologicznej i aktualnej tolerancji cery.",
    focus: "Kierunek działania: NACZYNKA • RUMIEŃ • BARIERA • KOMFORT • Pielęgnacja bez przegrzewania tkanki",
    image: "/src/assets/images/rosacea_calm_1790249310213.jpg",
    indications: [
      "Widoczne, rozszerzone naczynka krwionośne (teleangiektazje)",
      "Okresowe lub utrwalone zaczerwienienie skóry",
      "Skłonność do rumienia pod wpływem temperatury, stresu lub emocji",
      "Nadmierna reaktywność i uczucie gorąca",
      "Pieczenie, ściągnięcie albo dyskomfort naskórka",
      "Osłabiona bariera i jednoczesna skłonność do zaczerwienienia",
      "Nierównomierny koloryt związany z reaktywnością naczyniową",
      "Słaba tolerancja intensywnych kosmetyków i zabiegów"
    ],
    contraindications: [
      "Aktywne infekcje i stany zapalne skóry",
      "Opryszczka w fazie aktywnej",
      "Otwarte rany i świeże oparzenia",
      "Alergia na składniki planowanych preparatów",
      "Stosowanie leków zwiększających wrażliwość na światło (w przypadku technologii świetlnej)",
      "Przeciwwskazania właściwe dla wybranej metody aparaturowej"
    ],
    postTreatmentCare: [
      "Delikatne oczyszczanie i stosowanie zaleconej pielęgnacji barierowej",
      "Czasowe ograniczenie peelingów, retinoidów i intensywnie działających kwasów",
      "Unikanie gorącej wody, sauny, intensywnego wysiłku i nagłych zmian temperatury",
      "Codzienna ochrona przeciwsłoneczna dopasowana do tolerancji skóry",
      "Obserwowanie reakcji skóry i przestrzeganie indywidualnych zaleceń"
    ],
    activeSubstances: [
      "Baza bionomiczna oraz koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Substancje wspierające komfort skóry skłonnej do zaczerwienienia",
      "Ochrona antyoksydacyjna i składniki ograniczające utratę wody",
      "Lipidy odbudowujące architekturę ochronną naskórka"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza biologiczna", description: "Oceniane są charakter zaczerwienienia, widoczność naczynek, reaktywność, nawodnienie, komfort i stan bariery. Analizowane są również czynniki mogące nasilać rumień." },
      { phase: "2. Delikatne oczyszczanie", description: "Skóra zostaje przygotowana bez intensywnego tarcia, nadmiernego odtłuszczania i niepotrzebnego rozgrzewania." },
      { phase: "3. Spersonalizowany koktajl zabiegowy", description: "Bezpośrednio przy klientce komponowany jest koktajl z odpowiedniej bazy i koncentratów aktywnych dermaviduals®, odpowiadający aktualnym potrzebom i biologicznej gotowości skóry." },
      { phase: "4. Wyciszenie i ochrona", description: "Końcowy etap wspiera nawodnienie, komfort i barierę naskórkową. Jeżeli kondycja skóry na to pozwala, zabieg może zostać uzupełniony odpowiednio dobraną łagodną technologią." }
    ],
    faq: [
      {
        question: "Czy Couperose Therapy™ trwale zamyka naczynka?",
        answer: "Pielęgnacja kosmetologiczna wspiera kondycję skóry naczyniowej, łagodzi rumień i wzmacnia odporność naskórka, ale nie służy inwazyjnemu usuwaniu utrwalonych zmian naczyniowych. Procedury laserowego zamykania naczyń stanowią odrębną dziedzinę specjalistyczną.",
        category: "Efekty"
      }
    ]
  },
  {
    id: "pigment-balance-therapy",
    title: "Pigment Balance Therapy™",
    subtitle: "Spersonalizowana terapia przebarwień i nierównomiernego kolorytu",
    duration: "80–90 minut",
    price: "400 PLN — 550 PLN, zależnie od zakresu zabiegu",
    description: "Pigment Balance Therapy™ to indywidualnie projektowana terapia dla skóry z przebarwieniami posłonecznymi, pozapalnymi, melasmą oraz nierównomiernym kolorytem. Przebarwienie nie jest wyłącznie zmianą widoczną na powierzchni — na jego powstawanie i utrwalanie wpływają promieniowanie UV, stan zapalny, reaktywność skóry, hormony, temperatura, urazy oraz niewłaściwie dobrana pielęgnacja. Dlatego terapia rozpoczyna się od rozpoznania rodzaju przebarwienia, kondycji bariery i czynników mogących podtrzymywać problem. Dopiero na tej podstawie dobierane są substancje biologicznie aktywne, technologia, intensywność i kolejność działań.",
    focus: "Kierunek działania: PRZEBARWIENIA • KOLORYT • ODNOWA • OCHRONA • Bezpieczna terapia bez stanu zapalnego",
    image: "/src/assets/images/pigment_balance_1790249364420.jpg",
    indications: [
      "Przebarwienia posłoneczne",
      "Przebarwienia pozapalne po niedoskonałościach (PIH)",
      "Melasma (ostuda hormonalna)",
      "Nierównomierny lub szary koloryt skóry",
      "Plamy nasilające się po ekspozycji na słońce",
      "Przebarwienia powstałe po podrażnieniu lub zbyt intensywnych zabiegach",
      "Jednoczesna obecność przebarwień, odwodnienia i osłabionej bariery",
      "Skłonność do nawrotów zmian pigmentacyjnych"
    ],
    contraindications: [
      "Aktywne infekcje i stany zapalne skóry, opryszczka w fazie aktywnej",
      "Przerwanie ciągłości naskórka, świeże oparzenia słoneczne lub intensywna opalenizna",
      "Alergia na składniki planowanych preparatów",
      "Ciąża i karmienie piersią w przypadku wybranych substancji oraz technologii",
      "Stosowanie leków zwiększających wrażliwość skóry na światło",
      "Podejrzane lub niezdiagnozowane dermatologicznie zmiany barwnikowe",
      "Przeciwwskazania właściwe dla wybranej metody"
    ],
    postTreatmentCare: [
      "Łagodne oczyszczanie i ochrona bariery naskórkowej",
      "Indywidualnie dobrane substancje aktywne hamujące melanogenezę",
      "Codzienna ochrona przeciwsłoneczna o szerokim spektrum ponawiana w ciągu dnia",
      "Ograniczenie samodzielnego stosowania silnych peelingów i przypadkowego łączenia kwasów",
      "Obserwowanie reakcji skóry i modyfikowanie pielęgnacji wraz ze zmianą jej kondycji"
    ],
    activeSubstances: [
      "Baza bionomiczna i koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Odpowiednio dobrane formy witaminy C, niacynamid, składniki antyoksydacyjne",
      "Substancje wspierające fizjologiczną odnowę naskórka bez stanu zapalnego",
      "Składniki odbudowujące barierę i ograniczające reaktywność podtrzymującą przebarwienia"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza biologiczna", description: "Oceniane są rodzaj, rozmieszczenie i charakter przebarwień, koloryt, reaktywność, sposób rogowacenia oraz stan bariery. Uwzględniane są czynniki nasilające pigmentację." },
      { phase: "2. Przygotowanie skóry", description: "Sposób oczyszczania i odnowy powierzchni naskórka dobierany jest do aktualnej tolerancji skóry. Przy osłabionej barierze pierwszym etapem może być jej odbudowa." },
      { phase: "3. Spersonalizowany koktajl zabiegowy", description: "Przy klientce komponowany jest koktajl z odpowiedniej bazy i koncentratów aktywnych dermaviduals®. Jego skład wynika z rodzaju przebarwień oraz biologicznego celu terapii." },
      { phase: "4. Indywidualnie dobrana technologia", description: "Metoda zastosowania składników (nanobrazja, mezoterapia bezigłowa, infuzja tlenowa, mikronakłuwanie) dopasowywana jest do gotowości skóry, pory roku i ryzyka nasilenia pigmentacji." },
      { phase: "5. Ochrona i plan dalszego postępowania", description: "Końcowy etap wspiera komfort i barierę naskórkową. Ustalane są fotoprotekcja, pielęgnacja domowa oraz termin kolejnego działania." }
    ],
    faq: [
      {
        question: "Dlaczego w terapii przebarwień kluczowa jest ochrona bariery naskórkowej?",
        answer: "Przebarwień nie należy traktować wyłącznie jako plam widocznych na powierzchni. Każdy stan zapalny wywołany zbyt agresywnym złuszczaniem stymuluje melanocyty do obronnej nadprodukcji barwnika (tzw. hiperpigmentacja pozapalna). Skuteczna terapia wymaga wyciszenia stanu zapalnego, przygotowania bariery i precyzyjnych inhibitorów melanogenezy.",
        category: "Biologia pigmentu"
      }
    ]
  },
  {
    id: "skin-remodeling-therapy",
    title: "Skin Remodeling Therapy™",
    subtitle: "Indywidualnie projektowana terapia jędrności, gęstości i owalu twarzy",
    duration: "około 90 minut",
    price: "500 PLN — 750 PLN, zależnie od dobranej metody i zakresu zabiegu",
    description: "Skin Remodeling Therapy™ to wielopoziomowa terapia dla skóry, która traci jędrność, elastyczność i wyraźny kontur. Nie opiera się na jednej technologii ani gotowym protokole. Jej przebieg projektowany jest na podstawie diagnozy biologicznej, aktualnej kondycji tkanek oraz gotowości skóry do określonego rodzaju stymulacji. W zależności od potrzeb dobierane są metody oddziałujące na różne poziomy — od pracy manualnej i neuromięśniowej, przez technologie nieinwazyjne, aż po intensywniejsze procedury przebudowujące. Znaczenie ma nie liczba zastosowanych metod, lecz ich właściwa kolejność, intensywność i czas potrzebny skórze na regenerację. Skin Remodeling Therapy™ nie oznacza zastosowania najsilniejszej technologii — oznacza wybór takiego bodźca, który skóra jest gotowa prawidłowo wykorzystać.",
    focus: "Kierunek działania: JĘDRNOŚĆ • GĘSTOŚĆ • OWAL • REGENERACJA • Przebudowa tkanek na odpowiednim poziomie biologicznym",
    image: "/src/assets/images/remodeling_therapy_1790249327484.jpg",
    indications: [
      "Utrata jędrności, elastyczności i gęstości skóry",
      "Zmiana owalu twarzy i opadanie tkanek",
      "Zmarszczki mimiczne oraz utrwalone linie",
      "Pogłębiające się bruzdy nosowo-wargowe",
      "Wiotkość skóry twarzy, szyi lub dekoltu",
      "Zmiany związane z menopauzą i spadkiem aktywności hormonalnej",
      "Pogorszenie struktury skóry po redukcji masy ciała",
      "Potrzeba długofalowego wsparcia procesów regeneracyjnych"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywne infekcje i stany zapalne skóry",
      "Aktywna choroba nowotworowa",
      "Rozrusznik serca lub inne urządzenia elektroniczne (przy wybranych technologiach)",
      "Metalowe implanty w obszarze zabiegowym",
      "Zaburzenia krzepnięcia i stosowanie leków wpływających na krzepliwość",
      "Świeżo przebyte zabiegi chirurgiczne lub inwazyjne procedury estetyczne",
      "Przeciwwskazania właściwe dla konkretnej dobranej metody"
    ],
    postTreatmentCare: [
      "Zalecenia pozabiegowe ustalane indywidualnie stosownie do zastosowanej technologii",
      "Czasowe ograniczenie składników drażniących, intensywnego wysiłku, sauny i ekspozycji na słońce",
      "Rygorystyczna codzienna fotoprotekcja mineralno-organiczna",
      "Stosowanie dedykowanej pielęgnacji barierowej wspierającej syntezę kolagenu"
    ],
    activeSubstances: [
      "Substancje wspierające procesy wytwarzania kolagenu, elastyny i kwasu hialuronowego",
      "Baza bionomiczna i koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Prekursory, kofaktory i składniki sygnałowe dobrane do biologicznego celu terapii",
      "Składniki antyoksydacyjne i chroniące barierę naskórkową"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza i ocena gotowości", description: "Oceniane są jędrność, elastyczność, struktura skóry, owal twarzy, napięcia mięśniowe oraz zdolność skóry do regeneracji po bodźcu." },
      { phase: "2. Wybór poziomu i metody działania", description: "Określany jest najważniejszy cel terapii oraz technologia odpowiadająca aktualnym potrzebom i możliwościom skóry." },
      { phase: "3. Indywidualnie zaprojektowany zabieg", description: "Zastosowane metody mogą obejmować techniki manualne, neurolifting, mezoterapię bezigłową/mikroigłową, radiofrekwencję lub HIFU. Intensywność i kolejność wynikają z analizy." },
      { phase: "4. Ochrona i plan dalszej regeneracji", description: "Końcowy etap dobierany jest do zastosowanej technologii. Ustalane są również pielęgnacja domowa, czas regeneracji oraz termin kolejnego działania." }
    ],
    faq: [
      {
        question: "Dlaczego Skin Remodeling Therapy™ nie opiera się na jednym urządzeniu u każdego?",
        answer: "Ta sama oznaka starzenia może wynikać z zupełnie różnych mechanizmów. U jednej osoby kluczowa jest utrata gęstości naskórka, u innej napięcia mięśniowo-powięziowe, zmiana ułożenia tkanek lub osłabiona bariera. Dlatego najpierw określamy poziom wymagający wsparcia, a dopiero potem dobieramy odpowiednie narzędzie i sekwencję.",
        category: "Koncepcja"
      }
    ]
  },
  {
    id: "lift-firm-therapy",
    title: "Skin Remodeling Therapy™ (Lift & Firm)",
    subtitle: "Indywidualnie projektowana terapia jędrności, gęstości i owalu twarzy",
    duration: "około 90 minut",
    price: "500 PLN — 750 PLN, zależnie od dobranej metody i zakresu zabiegu",
    description: "Skin Remodeling Therapy™ to wielopoziomowa terapia dla skóry, która traci jędrność, elastyczność i wyraźny kontur. Nie opiera się na jednej technologii ani gotowym protokole. Jej przebieg projektowany jest na podstawie diagnozy biologicznej, aktualnej kondycji tkanek oraz gotowości skóry do określonego rodzaju stymulacji. Znaczenie ma nie liczba zastosowanych metod, lecz ich właściwa kolejność, intensywność i czas potrzebny skórze na regenerację.",
    focus: "Kierunek działania: JĘDRNOŚĆ • GĘSTOŚĆ • OWAL • REGENERACJA • Przebudowa tkanek na odpowiednim poziomie biologicznym",
    image: "/src/assets/images/remodeling_therapy_1790249327484.jpg",
    indications: [
      "Utrata jędrności, elastyczności i gęstości skóry",
      "Zmiana owalu twarzy i opadanie tkanek",
      "Zmarszczki mimiczne oraz utrwalone linie",
      "Pogłębiające się bruzdy nosowo-wargowe",
      "Wiotkość skóry twarzy, szyi lub dekoltu",
      "Zmiany związane z menopauzą i spadkiem aktywności hormonalnej"
    ],
    contraindications: [
      "Ciąża i karmienie piersią",
      "Rozrusznik serca lub metalowe implanty w obszarze zabiegowym (przy wybranych technologiach)",
      "Aktywna choroba nowotworowa i ostre infekcje skórne"
    ],
    postTreatmentCare: [
      "Stosowanie dedykowanej pielęgnacji barierowej wspierającej syntezę kolagenu",
      "Dbałość o optymalne nawodnienie organizmu (min. 2 litry wody dziennie)",
      "Unikanie sauny, intensywnego rozgrzewania i mocnych peelingów po zabiegu"
    ],
    activeSubstances: [
      "Peptydy biomimetyczne i czynniki sygnałowe wspierające elastyczność",
      "Baza bionomiczna i koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Drobnocząsteczkowy kwas hialuronowy i krzemionka organiczna"
    ],
    protocolSteps: [
      { phase: "1. Diagnoza i ocena gotowości", description: "Oceniane są jędrność, elastyczność, struktura skóry, owal twarzy i napięcia mięśniowe." },
      { phase: "2. Wybór poziomu i metody działania", description: "Określany jest najważniejszy cel terapii oraz technologia odpowiadająca potrzebom skóry." },
      { phase: "3. Indywidualnie zaprojektowany zabieg", description: "Zastosowanie metod działających na wybranym poziomie tkanek ze stałą kontrolą reakcji." },
      { phase: "4. Ochrona i plan dalszej regeneracji", description: "Końcowy etap barierowy oraz zalecenia domowe i termin kolejnego spotkania." }
    ],
    faq: [
      {
        question: "Kiedy widoczne są rezultaty zabiegu?",
        answer: "Uczucie odświeżenia i poprawy napięcia widoczne jest bezpośrednio po wizycie, natomiast głęboka przebudowa kolagenu i poprawa gęstości rozwijają się stopniowo w kolejnych tygodniach.",
        category: "Efekty"
      }
    ]
  },
  {
    id: "healthy-glow-therapy",
    title: "Healthy Glow Therapy™",
    subtitle: "Spersonalizowana terapia dla skóry zmęczonej, szarej i pozbawionej blasku",
    duration: "75–90 minut",
    price: "400 PLN — 500 PLN, zależnie od zakresu zabiegu",
    description: "Healthy Glow Therapy™ to indywidualnie komponowany zabieg dla skóry, która utraciła świeżość, równomierny koloryt i naturalny blask. Łączy delikatne odświeżenie powierzchni naskórka z intensywnym nawilżeniem, ochroną antyoksydacyjną i zastosowaniem substancji biologicznie aktywnych dobranych do aktualnej kondycji skóry. To nie jest jeden zabieg bankietowy wykonywany według gotowego schematu. Innego wsparcia może potrzebować skóra odwodniona i przeciążona pielęgnacją, a innego skóra z nierównym kolorytem, oznakami stresu oksydacyjnego lub spowolnioną odnową naskórka. Healthy Glow Therapy™ nie maskuje skóry efektem powierzchownego rozświetlenia — łączy biologicznie uzasadnione składniki i indywidualnie dobraną technologię, aby wspierać jej nawodnienie, odnowę i naturalny blask.",
    focus: "Kierunek działania: NAWODNIENIE • ROZŚWIETLENIE • ANTYOKSYDACJA • REWITALIZACJA",
    image: "/src/assets/images/healthy_glow_1790249342266.jpg",
    indications: [
      "Skóra wygląda na szarą, zmęczoną i pozbawioną blasku",
      "Jest odwodniona, szorstka lub ma nierówną powierzchnię",
      "Ma niejednolity koloryt",
      "Jest narażona na stres, zanieczyszczenia i czynniki środowiskowe",
      "Potrzebuje odświeżenia po okresie przemęczenia lub intensywnego trybu życia",
      "Wymaga regeneracji po niewłaściwie dobranej pielęgnacji",
      "Ma wyglądać świeżo i promiennie przed ważnym wydarzeniem"
    ],
    contraindications: [
      "Aktywne infekcje i stany zapalne skóry",
      "Opryszczka w fazie aktywnej",
      "Otwarte rany i świeże oparzenia słoneczne",
      "Alergia na składniki planowanych preparatów",
      "Przeciwwskazania właściwe dla wybranej metody aparaturowej"
    ],
    postTreatmentCare: [
      "Łagodne oczyszczanie i stosowanie zaleconej pielęgnacji nawilżającej",
      "Czasowe ograniczenie peelingów, retinoidów i silnie działających kwasów",
      "Codzienna ochrona przeciwsłoneczna",
      "Unikanie dodatkowych, intensywnych zabiegów przez wskazany czas",
      "Utrzymanie regularnej pielęgnacji domowej"
    ],
    activeSubstances: [
      "Baza bionomiczna oraz koncentraty aktywne dermaviduals® komponowane przy klientce",
      "Substancje wspierające nawodnienie i fizjologiczną odnowę naskórka",
      "Składniki antyoksydacyjne chroniące przed stresem miejskim",
      "Kompleksy wyrównujące koloryt i poprawiające komfort cery"
    ],
    protocolSteps: [
      { phase: "1. Ocena kondycji skóry", description: "Analizowane są poziom nawodnienia, sposób rogowacenia, koloryt, reaktywność i stan bariery. Na tej podstawie określany jest główny kierunek działania." },
      { phase: "2. Oczyszczanie i przygotowanie naskórka", description: "Sposób oczyszczania oraz ewentualnego złuszczania dobierany jest do tolerancji skóry. Celem jest odświeżenie powierzchni bez naruszania jej naturalnej ochrony." },
      { phase: "3. Spersonalizowana faza aktywna", description: "Dobierany jest koktajl substancji biologicznie aktywnych oraz metoda umożliwiająca ich zastosowanie (infuzja tlenowa, mezoterapia bezigłowa lub inna odpowiednio dobrana technologia)." },
      { phase: "4. Nawodnienie i ochrona", description: "Końcowy etap wspiera komfort, miękkość i funkcjonowanie bariery. Zastosowana pielęgnacja zabezpiecza skórę i pomaga utrzymać efekt świeżości." }
    ],
    faq: [
      {
        question: "Czym Healthy Glow Therapy™ różni się od typowych zabiegów bankietowych?",
        answer: "Typowe zabiegi bankietowe często dają krótkotrwały efekt powierzchownego filmu lub przekrwienia, który szybko mija. Healthy Glow Therapy™ to praca biologiczna: głębokie nawodnienie, wsparcie mikrobiomu i antyoksydacja, co daje autentyczny, długo utrzymujący się blask zdrowej i wypoczętej cery.",
        category: "Koncepcja"
      }
    ]
  },
  {
    id: "neurolifting-nogier",
    title: "Neurolifting — Rytuał Odprężający dla Twarzy",
    subtitle: "Masaż powięziowy, delikatne mikroprądy i głębokie rozluźnienie napięć",
    duration: "40–50 min (Podstawowy) / 75 min (Rozszerzony)",
    price: "600 PLN / 900 PLN (Wariant rozszerzony z pielęgnacją domową)",
    description: "Głęboko relaksujący, autorski rytuał pracy z mięśniami i tkankami twarzy. Łączy techniki masażu rozluźniającego spięte mięśnie mimiczne z delikatnymi, bezpiecznymi mikroimpulsami. Pomaga zmniejszyć obrzęki, wygładzić rysy twarzy zmęczone stresem i przywrócić cerze wypoczęty, promienny wygląd.",
    focus: "Rozluźnienie napięć mięśni mimicznych, redukcja obrzęków i zastojów, ukojenie i naturalny lifting",
    image: "/src/assets/images/neurolifting_acupuncture_treatment.png",
    indications: [
      "Osoby poszukujące w pełni naturalnych metod poprawy owalu i zagęszczenia tkanek",
      "Skłonność do obrzęków, zastojów limfatycznych i worków pod oczami",
      "Narażenie na chroniczny stres, bruksizm i wielogodzinną pracę przed ekranami",
      "Utrata elastyczności, szary koloryt i zaburzona hydratacja macierzy powięziowej"
    ],
    contraindications: [
      "Rozrusznik serca lub aktywne implanty elektroniczne",
      "Ciąża oraz okres karmienia piersią",
      "Epilepsja i aktywne zaburzenia neurologiczne napadowe",
      "Aktywna choroba nowotworowa"
    ],
    postTreatmentCare: [
      "W wariancie rozszerzonym: aplikacja zestawu delikatnych miniproduktów do pielęgnacji domowej na 3–5 dni",
      "Dbałość o optymalne nawodnienie organizmu (min. 2 litry wody dziennie)",
      "Unikanie sauny, basenu i intensywnego wysiłku przez 48 godzin"
    ],
    activeSubstances: [
      "Peptydy i składniki wspierające regenerację skóry",
      "Kwas hialuronowy o działaniu głęboko nawilżającym",
      "Czysta ektoina i aminokwasy łagodzące",
      "Ceramidy wspierające barierę ochronną"
    ],
    protocolSteps: [
      { phase: "I — Przygotowanie i Oczyszczenie", description: "Delikatny demakijaż i przygotowanie skóry do masażu." },
      { phase: "II — Drenaż i Relaksacja", description: "Usprawnienie krążenia limfy i redukcja porannych obrzęków." },
      { phase: "III — Masaż Neuroliftingujący", description: "Autorska praca manualna z mięśniami twarzy i delikatnymi mikroprądami." },
      { phase: "IV — Pielęgnacja Okolicy Oka & Kompres", description: "Troskliwa opieka nad wrażliwą skórą wokół oczu i krem ochronny." }
    ],
    faq: [
      {
        question: "Czym jest Neurolifting?",
        answer: "To łagodna metoda pracy z mięśniami twarzy, która łączy relaksujący masaż z delikatnymi mikroimpulsami. Pomaga rozluźnić napięcia powstałe ze stresu, zmniejszyć obrzęki i przywrócić wypoczęty wygląd.",
        category: "Koncepcja"
      }
    ]
  },
  {
    id: "amber-regeneration",
    title: "Regeneracja Kwasem Bursztynowym",
    subtitle: "Rytuał odnowy i rewitalizacji cery zmęczonej",
    duration: "90 minut",
    price: "450 PLN",
    description: "Autorski rytuał rewitalizacji skóry, łączący łagodne wygładzenie naskórka, odżywczy kwas bursztynowy, relaksujący masaż modelujący oraz kojącą maskę pod światłem LED. Pomaga przywrócić cerze energię, promienny blask i aksamitną gładkość.",
    focus: "Rewitalizacja cery, wygładzenie, naturalny blask i odprężenie",
    image: "/src/assets/images/regenerated_image_1781694292285.jpg",
    indications: [
      "Skóra zmęczona, szara, pozbawiona blasku",
      "Pierwsze oznaki utraty jędrności i elastyczności",
      "Suchość naskórka i spadek nawilżenia",
      "Napięcia mimiczne wywołane stresem"
    ],
    contraindications: [
      "Aktywna opryszczka, uszkodzenia i rany w rejonie zabiegowym",
      "Ostre infekcje bakteryjne lub wirusowe",
      "Alergia na składniki rytuału"
    ],
    postTreatmentCare: [
      "Unikanie sauny, basenu i intensywnego wysiłku przez 24-48h",
      "Stosowanie łagodnych kremów nawilżających",
      "Codzienna ochrona filtrem SPF 50+"
    ],
    activeSubstances: [
      "Kwas bursztynowy (wsparcie witalności skóry)",
      "Karnozyna i antyoksydanty roślinne",
      "Składniki stymulujące nawilżenie naskórka",
      "Lipidy chroniące barierę ochronną"
    ],
    protocolSteps: [
      { phase: "I — Delikatne Wygładzenie", description: "Łagodne usunięcie zrogowaciałego naskórka i dotlenienie cery." },
      { phase: "II — Pielęgnacja Bursztynowa", description: "Aplikacja odżywczego serum z kwasem bursztynowym." },
      { phase: "III — Odżywienie Naskórka", description: "Wprowadzenie składników aktywnych w głąb skóry." },
      { phase: "IV — Masaż Modelujący", description: "Relaksujący masaż twarzy rozluźniający napięcia mimiczne." },
      { phase: "V — Maska Kojąca i Światło LED", description: "Wyciszenie skóry odżywczą maską pod delikatnym światłem LED." }
    ],
    faq: [
      {
        question: "Dla kogo przeznaczony jest zabieg bursztynowy?",
        answer: "To wspaniały zabieg dla osób, które czują, że ich skóra jest zmęczona pracą przed monitorem, przesuszona lub pozbawiona blasku, i pragną szybkiego efektu świeżości i relaksu.",
        category: "Wskazania"
      }
    ]
  },
  {
    id: "hifu-lifting",
    title: "HIFU — Lifting Ultradźwiękowy bez Skalpela",
    subtitle: "Zogniskowane fale ultradźwiękowe dla poprawy jędrności i owalu twarzy",
    duration: "60 — 90 minut",
    price: "600 PLN — 800 PLN",
    description: "Nowoczesna, bezinwazyjna metoda poprawy jędrności skóry. Technologia HIFU skupia fale ultradźwiękowe w głębszych warstwach skóry, stymulując naturalną produkcję kolagenu. Pomaga unieść kontury twarzy, poprawić elastyczność cery i wygładzić wiotką skórę na linii żuchwy i szyi.",
    focus: "Wsparcie jędrności, poprawa owalu twarzy i elastyczności skóry",
    image: "/src/assets/images/mesoremodeling.jpg",
    indications: [
      "Utrata wyrazistości owalu twarzy i spadek elastyczności skóry",
      "Wiotkość skóry szyi i dekoltu",
      "Spadek gęstości skóry wywołany upływem czasu"
    ],
    contraindications: [
      "Ciąża i karmienie piersią, choroba nowotworowa",
      "Metalowe implanty lub rozrusznik serca w obszarze zabiegowym",
      "Świeże wypełniacze lub botoks w miejscu zabiegu (odstęp min. 4-6 tygodni)"
    ],
    postTreatmentCare: [
      "Stosowanie delikatnych kremów nawilżających i łagodzących",
      "Unikanie mocnych peelingów przez kilka tygodni",
      "Codzienna fotoprotekcja filtrem SPF 50+"
    ],
    activeSubstances: [
      "Fale ultradźwiękowe stymulujące naturalną regenerację skóry"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Ocena Skóry", description: "Dokładne omówienie oczekiwań i zaplanowanie obszarów zabiegowych." },
      { phase: "II — Aplikacja Żelu", description: "Nałożenie żelu ułatwiającego przewodzenie fal ultradźwiękowych." },
      { phase: "III — Emisja Impulsów", description: "Precyzyjne, bezpieczne przykładanie głowicy ultradźwiękowej." },
      { phase: "IV — Kojący Krem", description: "Nałożenie łagodzącego kremu ochronnego." }
    ],
    faq: [
      {
        question: "Po jakim czasie widać efekty HIFU?",
        answer: "Pewne odczucie napięcia skóry zauważalne jest często już po zabiegu, natomiast pełniejszy efekt poprawy elastyczności rozwija się stopniowo w ciągu 2-3 miesięcy, w miarę jak skóra wytwarza nowy kolagen.",
        category: "Efekty"
      }
    ]
  },
  {
    id: "sonaris-pro-therapy",
    title: "Sonaris Pro Therapy",
    subtitle: "Nieinwazyjna terapia poprawiająca napięcie, gładkość i witalność skóry • Impulsy elektromagnetyczne",
    duration: "45 — 75 minut",
    price: "180 PLN — 350 PLN (Pakiety 6 zabiegów od 900 PLN)",
    description: "Komfortowy, w 100% nieinwazyjny zabieg wykorzystujący impulsy elektromagnetyczne aplikowane za pomocą specjalnie zaprojektowanych głowic. Procedura nie narusza ciągłości naskórka i nie wymaga okresu rekonwalescencji. W Slow Skin Concept™ technologia nie jest wykorzystywana według jednego, gotowego protokołu – obszar pracy, rodzaj głowicy, intensywność oraz czas działania są dobierane indywidualnie do kondycji, wrażliwości i aktualnej gotowości biologicznej skóry. Głowice urządzenia emitują impulsy elektromagnetyczne stanowiące łagodny bodziec wspierający fizjologiczne procesy odpowiedzialne za napięcie, mikrokrążenie i regenerację tkanek.",
    focus: "Impulsy elektromagnetyczne, poprawa napięcia i elastyczności, okolica oka, brak nakłuwania i rekonwalescencji",
    image: "/src/assets/images/sonaris_pro_therapy.webp",
    indications: [
      "Pierwsze oznaki starzenia oraz utrata napięcia i elastyczności skóry",
      "Drobne zmarszczki mimiczne oraz osłabienie owalu twarzy",
      "Zmęczony, poszarzały koloryt i nierówna struktura powierzchni naskórka",
      "Cienka i delikatna skóra wokół oczu (oznaki zmęczenia, potrzeba świeżości spojrzenia)",
      "Potrzeba łagodnej stymulacji bez nakłuwania i bez wyłączenia z codziennych aktywności",
      "Nieinwazyjne przygotowanie skóry do kolejnych etapów terapii lub procedura podtrzymująca rezultaty"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywna choroba nowotworowa",
      "Wszczepiony rozrusznik serca lub inne aktywne urządzenia elektroniczne",
      "Metalowe implanty w bezpośrednim obszarze zabiegowym",
      "Aktywna infekcja lub stan zapalny skóry (np. opryszczka w fazie aktywnej)",
      "Przerwanie ciągłości naskórka w polu zabiegowym",
      "Niewyrównane choroby ogólnoustrojowe",
      "Świeżo wykonane zabiegi chirurgiczne lub iniekcyjne w opracowywanym obszarze (wymagany odstęp)"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej, niedrażniącej pielęgnacji wspierającej nawilżenie i barierę naskórkową",
      "Unikanie intensywnych peelingów oraz retinoidów przez 24–48 godzin po sesji",
      "Ochrona skóry przed promieniowaniem UV i codzienne stosowanie fotoprotekcji SPF 50+",
      "Przestrzeganie indywidualnych wskazówek pielęgnacyjnych otrzymanych w gabinecie"
    ],
    activeSubstances: [
      "Impulsy elektromagnetyczne aplikowane dedykowanymi głowicami anatomicznymi",
      "Indywidualnie dobrane serum biomimetyczne (ektoina, kwas hialuronowy, neuropeptydy)",
      "Maska barierowa i biozgodne lipidy (ceramidy NP/AP/EOP) dopasowane do gotowości skóry",
      "Preparaty fotoprotekcyjne o czystym profilu bionomicznym SPF 50+"
    ],
    protocolSteps: [
      { phase: "I — Diagnoza i Kwalifikacja", description: "Ocena kondycji, napięcia, reaktywności oraz aktualnych potrzeb skóry. Wykluczenie przeciwwskazań do technologii elektromagnetycznej." },
      { phase: "II — Przygotowanie Skóry", description: "Dokładny bionomiczny demakijaż i łagodne oczyszczenie. Delikatny etap przygotowujący dopasowany do reaktywności cery." },
      { phase: "III — Terapia Sonaris Pro", description: "Opracowanie skóry odpowiednio dobraną głowicą elektromagnetyczną. Precyzyjne dostosowanie intensywności, czasu i zakresu działania do odpowiedzi tkanek." },
      { phase: "IV — Wsparcie Substancjami Aktywnymi", description: "Aplikacja indywidualnie dobranego serum lub koncentratu wspierającego nawilżenie, regenerację, barierę naskórkową lub napięcie." },
      { phase: "V — Wyciszenie i Ochrona", description: "Maska biomimetyczna, wykończenie preparatem barierowym oraz bezpieczna ochrona przeciwsłoneczna SPF 50+." }
    ],
    faq: [
      {
        question: "Czym dokładnie jest technologia Sonaris Pro i jak działa?",
        answer: "Sonaris Pro nie jest zabiegiem diagnostycznym ani klasycznym ultrasonograficznym „sonarem medycznym”. Jest nieinwazyjną technologią kosmetologiczną wykorzystującą impulsy elektromagnetyczne aplikowane specjalnie zaprojektowanymi głowicami. Fale oddziałują na opracowywany obszar bez uszkadzania powierzchni skóry, stanowiąc łagodny bodziec wspierający fizjologiczne procesy odpowiedzialne za kondycję, mikrokrążenie, napięcie i regenerację tkanek.",
        category: "Technologia"
      },
      {
        question: "Czy Sonaris Pro można bezpiecznie wykonywać na delikatną okolicę oczu?",
        answer: "Tak. Skóra wokół oczu jest wyjątkowo cienka i szybciej reaguje na zmęczenie, osłabienie mikrokrążenia oraz utratę elastyczności. Sonaris Pro umożliwia niezwykle delikatne opracowanie tej okolicy bez nakłuwania skóry i bez rekonwalescencji. Zabieg wspiera poprawę napięcia, wygładzenie drobnych zmarszczek i świeżość spojrzenia. Warto pamiętać: Sonaris Pro nie usuwa przepuklin tłuszczowych ani nadmiaru skóry powiek – w przypadku cieni czy obrzęków najpierw oceniamy ich biologiczną przyczynę.",
        category: "Okolica oka"
      },
      {
        question: "Jakie są odczucia podczas zabiegu i czy wymagana jest rekonwalescencja?",
        answer: "Sonaris Pro jest procedurą komfortową i nie wymaga znieczulenia. Podczas pracy głowicy odczuwalne jest przyjemne, delikatne ciepło, łagodne mrowienie lub subtelna stymulacja. Bezpośrednio po zabiegu może pojawić się krótkotrwałe zaczerwienienie (szczególnie przy cerze cienkiej i reaktywnej), lecz możliwy jest natychmiastowy powrót do codziennych aktywności.",
        category: "Komfort"
      },
      {
        question: "Ile zabiegów w serii jest rekomendowanych i jak często?",
        answer: "Zabieg może zostać wykonany jednorazowo (jako odświeżenie i poprawa napięcia), natomiast dla stabilnej poprawy kondycji skóry zalecana jest seria od 4 do 6 zabiegów wykonywanych co 7–14 dni, a następnie zabieg podtrzymujący co 4–8 tygodni. W Slow Skin Concept™ odstępy dobierane są indywidualnie na podstawie odpowiedzi biologicznej skóry, a nie sztywnego kalendarza.",
        category: "Seria"
      },
      {
        question: "Jak kształtuje się cennik pojedynczych zabiegów oraz pakietów Sonaris Pro?",
        answer: "Ceny pojedynczych zabiegów: Okolica oczu – 180 zł | Twarz – 250 zł | Twarz i okolica oczu – 300 zł | Twarz, szyja i dekolt – 350 zł. Pakiety 6 zabiegów (z dużym rabatem): Okolica oczu (pakiet 6) – 900 zł (150 zł/zabieg) | Twarz (pakiet 6) – 1250 zł (~208 zł/zabieg) | Twarz i okolica oczu (pakiet 6) – 1500 zł (250 zł/zabieg) | Twarz, szyja i dekolt (pakiet 6) – 1750 zł (~292 zł/zabieg).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "carboksyterapia-carboregen",
    title: "Carboksyterapia Twarzy CARBOregen",
    subtitle: "Iniekcyjna stymulacja mikrokrążenia i naturalnych procesów przebudowy skóry • Efekt Bohra",
    duration: "40 — 60 minut",
    price: "250 PLN — 450 PLN (Pakiety 5 zabiegów od 1100 PLN)",
    description: "Karboksyterapia jest zabiegiem iniekcyjnym polegającym na kontrolowanym podaniu dwutlenku węgla o certyfikowanej czystości laboratoryjnej do wybranych warstw skóry. CO₂ stanowi precyzyjny bodziec fizjologiczny, który powoduje miejscowe rozszerzenie naczyń i przejściowe zwiększenie przepływu krwi (efekt Bohra). Sprzyja to lepszemu dotlenieniu oraz odżywieniu tkanek i tworzy warunki wspierające ich naturalną regenerację. W Slow Skin Concept™ nie jest stosowany jeden protokół dla każdej skóry – obszar podania, głębokość iniekcji, przepływ, temperatura oraz ilość gazu w systemie CARBOregen są dobierane indywidualnie na podstawie kondycji skóry, jakości mikrokrążenia, wrażliwości tkanek i celu zabiegu.",
    focus: "Certyfikowany CO₂, stymulacja mikrokrążenia, dotlenienie tkanek (efekt Bohra), okolica oka, redukcja cieni i blizn",
    image: "/src/assets/images/carboxytherapy_carboregen.webp",
    indications: [
      "Zmęczony, ziemisty lub nierówny koloryt oraz osłabione mikrokrążenie",
      "Utrata jędrności i elastyczności skóry, drobne zmarszczki",
      "Pogorszenie struktury i gęstości skóry, wiotkość twarzy, szyi lub dekoltu",
      "Cienka i mało elastyczna skóra wokół oczu oraz wiotkość dolnej powieki",
      "Wybrane rodzaje cieni pod oczami związane z prześwitywaniem naczyń lub słabszym mikrokrążeniem",
      "Blizny potrądzikowe wymagające stopniowej przebudowy i stymulacji fibroblastów"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywna infekcja lub stan zapalny skóry (np. opryszczka w fazie aktywnej)",
      "Przerwanie ciągłości skóry w miejscu podania",
      "Zaburzenia krzepnięcia krwi i przyjmowanie leków przeciwkrzepliwych",
      "Ciężkie lub niewyrównane choroby serca, płuc albo nerek",
      "Aktywna choroba nowotworowa",
      "Niewyrównane choroby ogólnoustrojowe",
      "Świeżo wykonane zabiegi chirurgiczne lub iniekcyjne w opracowywanej okolicy (wymagany odstęp)"
    ],
    postTreatmentCare: [
      "Przez pierwszą dobę: nie uciskać i intensywnie nie masować skóry",
      "Rezygnacja z sauny, basenu, gorących kąpieli i intensywnego treningu przez min. 24 godziny",
      "Unikanie peelingów, retinoidów oraz drażniących kosmetyków przez 24–48 godzin",
      "Nie rozgrzewać intensywnie obszaru zabiegowego i chronić skórę przed UV (SPF 50+)",
      "Przestrzeganie indywidualnych zaleceń pielęgnacyjnych dobranych w gabinecie"
    ],
    activeSubstances: [
      "Certyfikowany dwutlenek węgla (CO₂) o najwyższej czystości laboratoryjnej",
      "System precyzyjnej kontroli temperatury, dawki i przepływu gazu CARBOregen",
      "Bionomiczne preparaty barierowe i łagodzące po iniekcji",
      "Fotoprotekcja mineralna o pełnym spektrum SPF 50+"
    ],
    protocolSteps: [
      { phase: "I — Diagnoza i Kwalifikacja", description: "Ocena kondycji, reaktywności i unaczynienia skóry oraz charakteru problemu. Dokładny wywiad zdrowotny i wykluczenie przeciwwskazań." },
      { phase: "II — Przygotowanie Skóry", description: "Dokładne oczyszczenie i profesjonalna dezynfekcja obszaru zabiegowego. Precyzyjne wyznaczenie punktów podania CO₂." },
      { phase: "III — Kontrolowane Podanie Czystego CO₂", description: "Wprowadzenie gazu za pomocą cienkiej igły do odpowiedniej warstwy skóry. Indywidualny dobór głębokości iniekcji, tempa przepływu i dawki gazu w systemie CARBOregen." },
      { phase: "IV — Wyciszenie i Ochrona Skóry", description: "Ocena odpowiedzi tkankowej, nałożenie preparatu barierowego wspierającego komfort i funkcjonowanie naskórka oraz fotoprotekcja." }
    ],
    faq: [
      {
        question: "Czym jest karboksyterapia CARBOregen i czym jest tzw. efekt Bohra?",
        answer: "Karboksyterapia polega na kontrolowanym śródskórnym podaniu certyfikowanego dwutlenku węgla (CO₂). Nie jest to bezpośrednie podawanie tlenu, lecz wywołanie naturalnej odpowiedzi organizmu. Obecność CO₂ powoduje natychmiastowe rozszerzenie naczyń krwionośnych oraz zjawisko fizjologiczne znane jako efekt Bohra – hemoglobina pod wpływem obniżonego pH łatwiej oddaje tlen do otaczających tkanek, co wywołuje kaskadę dotlenienia, odżywienia i syntezy kolagenu.",
        category: "Mechanizm"
      },
      {
        question: "Jakie są odczucia podczas zabiegu i jak wygląda skóra bezpośrednio po nim?",
        answer: "Podczas podawania CO₂ może pojawić się chwilowe rozpieranie, ucisk, ciepło, lekkie szczypanie lub odczucie przemieszczania się gazu pod skórą. W okolicy oczu naturalną reakcją jest krótkotrwałe uniesienie tkanek (tzw. poduszka gazowa), która ustępuje w ciągu kilkunastu minut. Bezpośrednio po zabiegu może wystąpić przejściowe zaczerwienienie, niewielki obrzęk lub drobne siniaki w miejscach wkłuć.",
        category: "Komfort"
      },
      {
        question: "Czy karboksyterapia jest skuteczna na cienie i zmarszczki pod oczami?",
        answer: "Tak, pod warunkiem prawidłowej kwalifikacji. Skóra wokół oczu jest cienka i podatna na zastoje naczyniowe. Karboksyterapia znakomicie wspiera redukcję cieni o podłożu naczyniowym, prześwitujących naczyń oraz wiotkości dolnej powieki. Zmiany wynikające z budowy anatomicznej (przepukliny tłuszczowe, nadmiar wiotkiej skóry powiek) wymagają jednak innych procedur.",
        category: "Okolica oka"
      },
      {
        question: "Ile zabiegów w serii jest rekomendowanych?",
        answer: "Zazwyczaj rekomenduje się serię zabiegów w odstępach 7–14 dni: na twarz, szyję lub dekolt – 4 do 6 zabiegów; na okolicę oczu – 4 do 8 zabiegów; w przypadku blizn potrądzikowych – 4 do 8 zabiegów. Kolejny zabieg wykonujemy wtedy, gdy tkanki są w pełni gotowe na następny bodziec.",
        category: "Seria"
      },
      {
        question: "Jak kształtuje się cennik zabiegów pojedynczych i pakietów CARBOregen?",
        answer: "Ceny pojedynczych zabiegów: Okolica oczu – 250 zł | Twarz – 300 zł | Twarz i okolica oczu – 380 zł | Twarz, szyja i dekolt – 450 zł. Pakiety 5 zabiegów: Okolica oczu (pakiet 5) – 1100 zł (220 zł/zabieg) | Twarz (pakiet 5) – 1350 zł (270 zł/zabieg) | Twarz i okolica oczu (pakiet 5) – 1700 zł (340 zł/zabieg) | Twarz, szyja i dekolt (pakiet 5) – 2000 zł (400 zł/zabieg).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "stymulatory-tkankowe",
    title: "Stymulatory Tkankowe",
    subtitle: "Indywidualna biostymulacja iniekcyjna • Poprawa jakości skóry • Stopniowa przebudowa tkanek",
    duration: "60 — 75 minut",
    price: "od 800 PLN (z fototerapią LED i konsultacją)",
    description: "Preparaty podawane zaawansowaną techniką iniekcyjną, których nadrzędnym zadaniem jest wspieranie naturalnych procesów bioregeneracji i fizjologicznej przebudowy skóry. W przeciwieństwie do klasycznych wypełniaczy ich celem nie jest dodawanie sztucznej objętości ani zmiana rysów twarzy. Odpowiednio dobrany biostymulator wspiera poprawę gęstości, jędrności, elastyczności oraz głębokiego nawodnienia. Efekt rozwija się stopniowo w czasie wraz z zachodzącą neokolagenezą. W Slow Skin Concept™ dobieramy preparat ściśle do biologicznych potrzeb skóry (polinukleotydy, kwas hialuronowy o niskiej masie, kompleksy aminokwasowe lub induktory kolagenu), a zabieg zawsze wieńczy kojąca fototerapia LED.",
    focus: "Polinukleotydy, aminokwasy, induktory kolagenu, naturalna biorewitalizacja bez sztucznej objętości, fototerapia LED",
    image: "/src/assets/images/tissue_stimulators.webp",
    indications: [
      "Utrata jędrności, elastyczności i napięcia oraz zmniejszenie gęstości skóry",
      "Drobne zmarszczki, linie mimiczne oraz utrata naturalnej sprężystości",
      "Cienka, atroficzna i osłabiona skóra twarzy, szyi, dekoltu lub dłoni",
      "Odwodnienie głębokie i pogorszenie ogólnej struktury naskórka",
      "Oznaki fotostarzenia słonecznego wymagające powolnej, bezpiecznej regeneracji",
      "Wymagająca wzmocnienia i zagęszczenia delikatna okolica oczu"
    ],
    contraindications: [
      "Ciąża oraz okres karmienia piersią",
      "Aktywne infekcje i stany zapalne skóry, w tym opryszczka w fazie aktywnej",
      "Alergia lub nadwrażliwość na składniki wybranego preparatu",
      "Zaburzenia krzepnięcia krwi i przyjmowanie leków przeciwzakrzepowych",
      "Aktywna choroba nowotworowa",
      "Nieuregulowane choroby autoimmunologiczne",
      "Skłonność do powstawania bliznowców i blizn przerostowych",
      "Świeżo wykonane zabiegi iniekcyjne lub chirurgiczne w tym samym obszarze"
    ],
    postTreatmentCare: [
      "Nie dotykać ani nie masować miejsc iniekcji bez wyraźnego zalecenia specjalisty",
      "Zachować bezwzględną czystość i higienę obszaru zabiegowego przez min. 48 godzin",
      "Zrezygnować z makijażu przez wskazany czas (zazwyczaj 12–24 godziny)",
      "Unikać sauny, basenu, solarium oraz intensywnego wysiłku fizycznego przez 48–72 godziny",
      "Nie wykonywać masaży twarzy ani innych procedur drażniących w danym obszarze",
      "Stosować delikatną pielęgnację barierową i obowiązkową fotoprotekcję SPF 50+"
    ],
    activeSubstances: [
      "Polinukleotydy (PDRN) – regeneracja mikrośrodowiska i naprawa DNA komórek",
      "Niekrosowany kwas hialuronowy o zróżnicowanej masie cząsteczkowej – biorewitalizacja hydro",
      "Kompleksy aminokwasowe (glicyna, prolina, lizyna) – substraty do syntezy kolagenu",
      "Biokompatybilne induktory kolagenu – głęboka stymulacja neokolagenezy i elastogenezy"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Kwalifikacja", description: "Szczegółowy wywiad konsultacyjny, analiza grubości, gęstości, stopnia nawodnienia i biologicznej gotowości tkanek. Wykluczenie przeciwwskazań." },
      { phase: "II — Dobór Preparatu i Planu Terapii", description: "Wybór optymalnej grupy preparatu (polinukleotydy, kwas hialuronowy, aminokwasy, induktory kolagenu) oraz precyzyjnej techniki podania." },
      { phase: "III — Przygotowanie Skóry", description: "Demakijaż bionomiczny, skrupulatna dezynfekcja obszaru iniekcyjnego oraz w razie potrzeby znieczulenie miejscowe delikatnym kremem okluzyjnym." },
      { phase: "IV — Podanie Biostymulatora", description: "Aplikacja preparatu mikronakłuciami lub kaniulą. Punkty depozytowe, głębokość i objętość są ściśle dopasowane do anatomii." },
      { phase: "V — Fototerapia LED i Wyciszenie", description: "Naświetlanie profesjonalnym światłem LED (LLLT), które przyspiesza regenerację, redukuje rumień i wycisza stany mikrozapalne po nakłuciach." }
    ],
    faq: [
      {
        question: "Czym różnią się stymulatory tkankowe od klasycznych wypełniaczy z kwasem hialuronowym?",
        answer: "Wypełniacze wolumetryczne służą do mechanicznego powiększania objętości (np. modelowania policzków czy ust) i mogą zmieniać rysy twarzy. Stymulatory tkankowe działają zupełnie inaczej – ich zadaniem jest biochemiczna aktywacja własnych komórek skóry (fibroblastów) do produkcji nowego kolagenu, elastyny i macierzy zewnątrzkomórkowej. Nie zmieniają rysów, nie pompują twarzy, lecz zagęszczają i odmładzają strukturę skóry od wewnątrz.",
        category: "Działanie"
      },
      {
        question: "Jak dobierany jest preparat do konkretnej skóry?",
        answer: "W Slow Skin Concept™ obowiązuje fundamentalna zasada: nie dobiera się skóry do modnego preparatu, lecz preparat do biologicznej kondycji skóry. Skóra cienka, atopowa czy poddana fotouszkodzeniom wokół oczu najlepiej odpowiada na polinukleotydy. Skóra przesuszona zyskuje najwięcej na kwasie hialuronowym i aminokwasach, natomiast skóra grubsza, z widoczną wiotkością grawitacyjną może wymagać silniejszych induktorów kolagenu.",
        category: "Kwalifikacja"
      },
      {
        question: "Kiedy widać efekty zabiegu i jak długo się utrzymują?",
        answer: "Efekt nie pojawia się w pełnej krasie od razu po wstaniu z fotela. Choć nawilżenie i świeżość zauważalne są szybko, to właściwa synteza nowego kolagenu i przebudowa gęstości skóry wymaga czasu biologicznego – rozwija się stopniowo przez 4 do 12 tygodni po sesji. Uzyskany rezultat jest naturalny i długotrwały (zwykle od 9 do nawet 18 miesięcy w zależności od kondycji wyjściowej).",
        category: "Efekty"
      },
      {
        question: "Ile zabiegów w serii jest zalecanych?",
        answer: "Plan terapii ustalany jest ściśle według protokołu wybranego preparatu i potrzeb skóry. Zazwyczaj jest to seria 2–4 zabiegów w odstępach od 2 do 4 tygodni, po której wykonuje się pojedynczy zabieg przypominający raz na 6–12 miesięcy. Nie tworzymy sztywnych pakietów 'dla każdego', bo każdy preparat posiada odmienną dynamikę działania.",
        category: "Seria"
      },
      {
        question: "Co zawiera cena zabiegu (od 800 zł)?",
        answer: "Cena zabiegu zaczyna się od 800 zł i jest procedurą kompletną: obejmuje pełną konsultację i kwalifikację zabiegową, indywidualny dobór certyfikowanego preparatu, iniekcję, znieczulenie miejscowe, regenerującą fototerapię LED wyciszającą skórę oraz spersonalizowany plan pielęgnacji pozabiegowej.",
        category: "Cennik"
      }
    ]
  },
  {
    id: "oksybrazja-infuzja-tlenowa",
    title: "Oksybrazja Tlenowa z Infuzją Tlenową",
    subtitle: "Tlenowo-solna odnowa naskórka • Spersonalizowana pielęgnacja • Bez okresu rekonwalescencji",
    duration: "60 — 75 minut",
    price: "350 PLN — 450 PLN (Pakiety 4 zabiegów od 1260 PLN)",
    description: "Dwuetapowy, bezpieczny zabieg łączący delikatne mikrozłuszczanie naskórka z zaawansowaną aplikacją składników aktywnych pod ciśnieniem czystego tlenu. W pierwszym etapie chłodny strumień tlenu i soli fizjologicznej bezdotykowo usuwa martwe komórki naskórka, odświeża i koi skórę. W drugim etapie spersonalizowany koktajl odżywczy (nawilżający, kojący barierę, wyrównujący koloryt lub regenerujący) jest wprowadzany infuzją tlenową. Zabieg w 100% nieinwazyjny, idealny przed ważnym wydarzeniem oraz dla cer wrażliwych i naczyniowych.",
    focus: "Tlenowo-solna mikrodermabrazja, czysty tlen pod ciśnieniem, NMF, ectoina, peptydy, brak rekonwalescencji, efekt 'red carpet'",
    image: "/src/assets/images/oksybrazja_infuzja_tlenowa.webp",
    indications: [
      "Skóra sucha, odwodniona, ściągnięta i szorstka w dotyku",
      "Cera poszarzała, matowa, zmęczona i pozbawiona naturalnego blasku",
      "Nierówna struktura oraz nadmierne rogowacenie naskórka",
      "Skóra wrażliwa, płytko unaczyniona, źle tolerująca tradycyjne peelingi chemiczne",
      "Cera obciążona zanieczyszczeniami miejskimi i smogiem",
      "Potrzeba natychmiastowego odświeżenia i wygładzenia przed wielkim wyjściem (zabieg bankietowy)",
      "Łagodne, bezpieczne przygotowanie naskórka do dalszych etapów terapii gabinetowej"
    ],
    contraindications: [
      "Aktywne infekcje bakteryjne, wirusowe (opryszczka w fazie wykwitu) i grzybicze",
      "Otwarte rany oraz przerwanie ciągłości naskórka w obszarze zabiegowym",
      "Nasilone zmiany ropne i zaostrzone stany zapalne (np. zaostrzenie trądziku pospolitego lub różowatego)",
      "Świeże oparzenia słoneczne",
      "Alergia lub nadwrażliwość na składniki wybranego koktajlu infuzyjnego",
      "Przeciwwskazania do pracy tlenem pod ciśnieniem (np. ostre zapalenie zatok w fazie ostrej)"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej, fizjologicznej pielęgnacji wspierającej barierę hydrolipidową",
      "Unikanie mocnych kwasów, retinoidów i peelingów ziarnistych przez kilka dni po zabiegu",
      "Rezygnacja z intensywnego pocierania oraz nadmiernego odtłuszczania naskórka",
      "Dbałość o regularne nawadnianie skóry preparatami z NMF, ceramidami i ektoiną",
      "Unikanie intensywnego rozgrzewania skóry (sauna, solarium) w dniu zabiegu",
      "Codzienna fotoprotekcja o szerokim spektrum SPF 50+"
    ],
    activeSubstances: [
      "Fizjologiczny roztwór soli 0,9% w strumieniu sprężonego tlenu",
      "Kwas hialuronowy o różnej masie cząsteczkowej oraz kompleks NMF (mocznik, mleczany, PCA)",
      "Ektoina, beta-glukan, pantenol i biozgodne lipidy barierowe",
      "Niacynamid, N-acetyloglukozamina i antyoksydanty wyciszające stres oksydacyjny",
      "Kompleksy peptydowe i aminokwasy wspierające fizjologiczną odnowę komórkową"
    ],
    protocolSteps: [
      { phase: "I — Ocena i Przygotowanie Skóry", description: "Dokładny wywiad kosmetyczny, analiza sposobu rogowacenia, poziomu nawodnienia i reaktywności bariery. Delikatne oczyszczenie bionomiczne." },
      { phase: "II — Oksybrazja Tlenowo-Solna", description: "Opracowanie skóry chłodnym strumieniem czystego tlenu i mikrokropel soli fizjologicznej. Beztraumatyczne złuszczenie i dotlenienie." },
      { phase: "III — Dobór Formuły Aktywnej", description: "Wybór spersonalizowanego koktajlu: nawadniającego, barierowego, rozświetlającego lub regenerującego pod aktualne potrzeby skóry." },
      { phase: "IV — Infuzja Tlenowa", description: "Równomierne wprowadzenie składników aktywnych za pomocą aerografu tlenowego pod ściśle kontrolowanym ciśnieniem." },
      { phase: "V — Wyciszenie i Ochrona Końcowa", description: "Aplikacja kremu biozgodnego uszczelniającego naskórek oraz mineralnej fotoprotekcji SPF 50+." }
    ],
    faq: [
      {
        question: "Czym różni się oksybrazja od tradycyjnej mikrodermabrazji diamentowej lub korundowej?",
        answer: "Oksybrazja jest najdelikatniejszą formą mikrodermabrazji, nazywaną mikrodermabrazją wodno-tlenową. Wykorzystuje jedynie tlen i sterylną sól fizjologiczną bez użycia jakichkolwiek ostrych kryształków czy diamentowych głowic ściernych. Działa bezdotykowo i chłodząco, dzięki czemu jest całkowicie bezpieczna nawet dla cer naczyniowych, z trądzikiem różowatym czy wyjątkowo reaktywnych.",
        category: "Metoda"
      },
      {
        question: "Na czym polega infuzja tlenowa i czy boli?",
        answer: "Infuzja tlenowa jest procedurą w 100% bezbolesną, niezwykle relaksującą i przyjemną. Za pomocą specjalnego dyspensera (aerografu) sprężony tlen pod kontrolowanym ciśnieniem 'wtłacza' cząsteczki skoncentrowanego serum w przestrzenie międzykomórkowe naskórka. Odczuwalny jest jedynie przyjemny, orzeźwiający chłód.",
        category: "Komfort"
      },
      {
        question: "Czy zabieg wymaga rekonwalescencji?",
        answer: "Nie, oksybrazja z infuzją tlenową nie wymaga żadnego okresu rekonwalescencji. Skóra bezpośrednio po zabiegu jest gładka, promienna, napięta i dogłębnie nawodniona, bez łuszczenia czy podrażnień. Jest to klasyczny zabieg 'bankietowy' – można go bezpiecznie wykonać nawet w dniu ważnego wydarzenia.",
        category: "Rekonwalescencja"
      },
      {
        question: "Ile zabiegów w serii warto wykonać?",
        answer: "Pojedynczy zabieg daje natychmiastowe odświeżenie i blask. Jeśli celem jest trwała poprawa nawilżenia, regeneracja bariery po zimie/lecie czy wygładzenie struktury naskórka, rekomendowana jest seria 4–6 zabiegów wykonywanych co 7–14 dni, z pakietem 4 wizyt o korzystniejszej cenie.",
        category: "Seria"
      },
      {
        question: "Jak kształtuje się cennik pojedynczych wizyt i pakietów 4 zabiegów?",
        answer: "Ceny pojedynczych zabiegów: Twarz – 350 zł | Twarz i szyja – 400 zł | Twarz, szyja i dekolt – 450 zł. Pakiety 4 zabiegów (z 10% rabatem): Twarz (pakiet 4) – 1260 zł (315 zł/zabieg) | Twarz i szyja (pakiet 4) – 1440 zł (360 zł/zabieg) | Twarz, szyja i dekolt (pakiet 4) – 1620 zł (405 zł/zabieg).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "oczyszczanie-wodorowe",
    title: "Oczyszczanie Wodorowe",
    subtitle: "Hydropeeling • Oczyszczenie powierzchni skóry • Wsparcie antyoksydacyjne",
    duration: "60 minut",
    price: "320 PLN — 420 PLN (Twarz, Szyja, Dekolt)",
    description: "Łagodny, wieloetapowy zabieg hydropeelingu przeznaczony dla cery zanieczyszczonej, matowej, łojotokowej lub narażonej na stres miejski i smog. Łączy przepływ aktywnej wody nasyconej cząsteczkowym wodorem z kontrolowanym podciśnieniem, dzięki czemu skutecznie usuwa nadmiar utlenionego sebum, zrogowaciałe komórki i zanieczyszczenia z ujść mieszków włosowych bez naruszania bariery lipidowej naskórka. W Slow Skin Concept™ zabieg ma odciążyć skórę, a nie agresywnie ją wyjaławiać – procedurę uzupełnia spersonalizowany koncentrat pielęgnacyjny, sonoforeza i kompres wyciszający.",
    focus: "Woda nasycona wodorem, kontrolowane podciśnienie, odciążenie porów, brak przesuszenia, ochrona bariery lipidowej",
    image: "/src/assets/images/oczyszczanie_wodorowe.webp",
    indications: [
      "Skóra zanieczyszczona, z tendencją do powstawania zaskórników i rozszerzonych porów",
      "Cera przetłuszczająca się, łojotokowa z widocznym nadmiarem utlenionego sebum",
      "Matowy, ziemisty i zmęczony koloryt pozbawiony świeżości",
      "Szorstka i nierówna struktura warstwy rogowej naskórka",
      "Ekspozycja na smog miejski, pyły zawieszone i stres oksydacyjny",
      "Potrzeba łagodnego, bezbolesnego oczyszczenia bez agresywnego łuszczenia chemicznego",
      "Przygotowanie fizjologiczne skóry przed kolejnymi procedurami terapeutycznymi"
    ],
    contraindications: [
      "Aktywne infekcje bakteryjne, grzybicze i wirusowe (opryszczka w fazie pęcherzykowej)",
      "Otwarte rany, przeczosy oraz mechaniczne uszkodzenia naskórka",
      "Nasilone stany zapalne w przebiegu trądziku (krosty i nacieki ropne w fazie zaostrzenia)",
      "Zaostrzone dermatozy (AZS, łuszczyca, zaostrzenie trądziku różowatego)",
      "Świeże oparzenia słoneczne",
      "Nadwrażliwość na składniki preparatów aplikowanych w fazie pielęgnacyjnej",
      "Przeciwwskazania do ultradźwięków/sonoforezy (w przypadku wyboru etapu uzupełniającego)"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej, fizjologicznej pielęgnacji domowej wspierającej mikrobiom",
      "Unikanie agresywnych peelingów ziarnistych i mocnych kwasów przez 3–5 dni",
      "Rezygnacja z intensywnego pocierania, mechanicznego wyciskania i przesuszania skóry",
      "Zapewnienie regularnego, głębokiego nawodnienia naskórka",
      "Unikanie sauny, chlorowanego basenu i intensywnego wysiłku w dniu zabiegu",
      "Codzienna ochrona przeciwsłoneczna preparatem z filtrem SPF 50+"
    ],
    activeSubstances: [
      "Woda nasycona aktywnym wodorem molekularnym (potencjał antyoksydacyjny)",
      "Fizjologiczne roztwory oczyszczające z ekstraktami roślinnymi i cynkiem",
      "Kwas hialuronowy o niskiej masie i naturalny czynnik nawilżający NMF",
      "Substancje kojące: d-pantenol, alantoina, ektoina i wyciąg z wąkroty azjatyckiej (Centella Asiatica)",
      "Biozgodne ceramidy odbudowujące płaszcz lipidowy"
    ],
    protocolSteps: [
      { phase: "I — Ocena i Przygotowanie Skóry", description: "Analiza rogowacenia, wydzielania sebum, reaktywności i integralności bariery. Delikatne oczyszczenie wstępne emulsją bionomiczną." },
      { phase: "II — Hydropeeling Wodorowy", description: "Opracowanie skóry głowicą próżniową z wirującym strumieniem wody wodorowej. Usunięcie zanieczyszczeń i sebum przy stałej kontroli podciśnienia." },
      { phase: "III — Pielęgnacja Ukierunkowana & Sonoforeza", description: "Wprowadzenie dobranego koncentratu nawilżającego, regulującego lub antyoksydacyjnego z użyciem ultradźwięków." },
      { phase: "IV — Wyciszenie i Ochrona Końcowa", description: "Maska kojąco-regenerująca lub kompres łagodzący, krem barierowy wzmacniający cement międzykomórkowy oraz fotoprotekcja SPF 50+." }
    ],
    faq: [
      {
        question: "Czym oczyszczanie wodorowe różni się od klasycznego manualnego oczyszczania twarzy?",
        answer: "Oczyszczanie wodorowe jest metodą bezdotykową i bezurazową – wykorzystuje strumień wody nasyconej wodorem oraz łagodne podciśnienie. Nie rozgniata tkanek, nie wywołuje obrzęków ani uszkodzeń naczyniek. Choć przy bardzo głębokich, zamkniętych zaskórnikach nie zastąpi specjalistycznej ekstrakcji gabinetowej, stanowi bezkonkurencyjny zabieg odświeżający pory i wygładzający powierzchnię naskórka.",
        category: "Metoda"
      },
      {
        question: "Czy oczyszczanie wodorowe 'wypłukuje toksyny' ze skóry?",
        answer: "W Slow Skin Concept™ stawiamy na rzetelną wiedzę biologiczną: cząsteczkowy wodór ma udowodnione właściwości antyoksydacyjne, jednak zabieg nie polega na 'wypłukiwaniu mitycznych toksyn'. Jego realnym i potwierdzonym działaniem jest dokładne, łagodne usunięcie martwych komórek, nadmiaru utlenionego sebum i miejskich pyłów oraz odciążenie aparatu włosowo-łojowego.",
        category: "Fizjologia"
      },
      {
        question: "Czy zabieg może przesuszyć skórę?",
        answer: "Absolutnie nie. Kluczowa zasada naszego gabinetu brzmi: oczyszczanie ma odciążyć skórę, a nie pozbawić jej naturalnej ochrony. Nie usuwamy całkowicie sebum, które jest niezbędne dla bariery naskórkowej. Parametry podciśnienia są kalibrowane indywidualnie, a zabieg zawsze wieńczy krem barierowy.",
        category: "Bezpieczeństwo"
      },
      {
        question: "Jak często można powtarzać hydropeeling wodorowy?",
        answer: "Zabieg można wykonać jednorazowo (np. jako odświeżenie cery) lub powtarzać w regularnych odstępach co około 3–4 tygodnie, co odpowiada naturalnemu cyklowi odnowy naskórka.",
        category: "Częstotliwość"
      },
      {
        question: "Co obejmuje cena zabiegu (od 320 zł)?",
        answer: "Cena obejmuje pełną procedurę: wyjściową ocenę kosmetologiczną, hydropeeling wodorowy dobraną głowicą, aplikację koncentratu substancji aktywnych (opcjonalnie z ultradźwiękami/sonoforezą), maskę wyciszającą oraz zabezpieczenie skóry kremem barierowym z SPF 50. Twarz: 320 zł | Twarz i szyja: 370 zł | Twarz, szyja i dekolt: 420 zł.",
        category: "Cennik"
      }
    ]
  },
  {
    id: "nanobrazja-nanopen",
    title: "Nanobrazja NanoPen",
    subtitle: "Kontrolowana odnowa naskórka • Nanodyskowa technologia • Indywidualne wsparcie skóry",
    duration: "60 — 75 minut",
    price: "350 PLN — 450 PLN (Pakiety 3 zabiegów od 945 PLN)",
    description: "Łagodny, nowoczesny zabieg łączący kontrolowane mikrozłuszczanie warstwy rogowej naskórka za pomocą sterylnego nanodysku, kojący masaż wibracyjny oraz precyzyjne stemplowanie wprowadzające preparaty aktywne. W odróżnieniu od klasycznej mezoterapii mikroigłowej, nanodyski nie nakłuwają żywych warstw skóry właściwej i nie powodują krwawienia ani konieczności rekonwalescencji. Procedura usuwa zrogowaciałe komórki, wygładza naskórek i tworzy optymalne warunki do biodostępności dobranych substancji odżywczych.",
    focus: "Jednorazowy kartridż z nanodyskiem, mikrozłuszczanie frakcyjne, stemplowanie, brak nakłuwania, zero rekonwalescencji",
    image: "/src/assets/images/nanobrazja_nanopen.webp",
    indications: [
      "Skóra szorstka, nierówna w strukturze lub nadmiernie zrogowaciała",
      "Cera sucha, odwodniona, pozbawiona komfortu i elastyczności",
      "Matowy, ziemisty i zmęczony koloryt pozbawiony naturalnego blasku",
      "Nierównomierny koloryt i przebarwienia powierzchowne",
      "Skóra zanieczyszczona lub z tendencją do powstawania zaskórników",
      "Cera łojotokowa z widocznymi, rozszerzonymi porami (bez ostrych stanów zapalnych)",
      "Potrzeba łagodnej, fizjologicznej odnowy naskórka bez nakłuwania igłami",
      "Przygotowanie powierzchni naskórka przed kolejnymi etapami terapii gabinetowej"
    ],
    contraindications: [
      "Aktywne infekcje bakteryjne, grzybicze i wirusowe (opryszczka w fazie pęcherzykowej)",
      "Otwarte rany, przerwanie ciągłości naskórka oraz nadżerki",
      "Nasilone zmiany ropne i zaostrzony stan zapalny (aktywny trądzik pospolity ze zmianami naciekowymi)",
      "Zaostrzone choroby dermatologiczne w obszarze zabiegowym (łuszczyca, AZS, wyprysk)",
      "Terapia doustnymi lub miejscowymi kortykosteroidami",
      "Świeża opalenizna słoneczna lub silne podrażnienia termiczne",
      "Alergia na składniki preparatów pielęgnacyjnych stosowanych podczas procedury"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej pielęgnacji fizjologicznej wspierającej barierę naskórkową",
      "Unikanie preparatów z kwasami AHA/BHA, retinoidów i peelingów przez 4–6 dni po zabiegu",
      "Rezygnacja z sauny, basenu z chlorowaną wodą oraz intensywnego przegrzewania skóry",
      "Bezwzględny zakaz samodzielnego pocierania lub mechanicznego złuszczania naskórka",
      "Codzienna ochrona przeciwsłoneczna preparatem o szerokim spektrum SPF 50+",
      "Przestrzeganie spersonalizowanych zaleceń domowych przekazanych przez kosmetologa"
    ],
    activeSubstances: [
      "Preparaty z kwasem hialuronowym i czynnikiem NMF dla natychmiastowego nawodnienia",
      "Ektoina, d-pantenol, beta-glukan i biozgodne lipidy kojące barierę",
      "Niacynamid, witamina C nowej generacji i bioflawonoidy wyrównujące koloryt",
      "Kompleksy peptydowe i aminokwasy wspierające fizjologiczny metabolizm naskórkowy"
    ],
    protocolSteps: [
      { phase: "I — Ocena Skóry i Gotowości", description: "Szczegółowa diagnoza stopnia rogowacenia, poziomu nawodnienia, kondycji bariery i reaktywności skóry. Wykluczenie przeciwwskazań." },
      { phase: "II — Oczyszczenie Bionomiczne", description: "Dokładne, delikatne oczyszczenie i przygotowanie skóry preparatami zoptymalizowanymi pod kątem nanobrazji." },
      { phase: "III — Frakcjonowanie Nanodyskowe", description: "Praca jednorazowym nanodyskiem NanoPen ruchem posuwistym. Delikatne, kontrolowane usunięcie martwych komórek warstwy rogowej." },
      { phase: "IV — Stemplowanie i Aplikacja Preparatu", description: "Aplikacja spersonalizowanego koncentratu odżywczego i technika stemplowania wspomagająca jego wykorzystanie przez naskórek." },
      { phase: "V — Wyciszenie i Ochrona Końcowa", description: "Maska lub emulsja wyciszająca, wsparcie płaszcza lipidowego oraz aplikacja mineralnego filtra SPF 50+." }
    ],
    faq: [
      {
        question: "Czym różni się Nanobrazja NanoPen od klasycznej mezoterapii mikroigłowej?",
        answer: "W klasycznej mezoterapii mikroigłowej igły przekłuwają naskórek i docierają do skóry właściwej, wywołując mikrokrawienie i stan zapalny wymagający rekonwalescencji. Nanobrazja wykorzystuje nanodyski – mikroskopijne piramidki krzemowe lub tytanowe, które działają wyłącznie na powierzchni warstwy rogowej naskórka. Zabieg jest bezbolesny, nie powoduje krwawienia i nie wyłącza z codziennego życia.",
        category: "Technologia"
      },
      {
        question: "Czy preparaty aplikowane podczas zabiegu trafiają do skóry właściwej?",
        answer: "W Slow Skin Concept™ stawiamy na uczciwość biologiczną: Nanobrazja działa w obrębie naskórka. Nie jest to zabieg iniekcyjny i nie transportuje kosmetyków w głąb skóry właściwej. Działa poprzez uporządkowanie warstwy rogowej, dzięki czemu zaaplikowane formuły aktywne są znacznie efektywniej wykorzystywane przez naskórek.",
        category: "Działanie"
      },
      {
        question: "Czy po zabiegu skóra jest mocno podrażniona?",
        answer: "Bezpośrednio po zabiegu może wystąpić delikatne, jednolite zaróżowienie i uczucie lekkiego ciepła, które zazwyczaj ustępuje w ciągu 1–2 godzin. Nie występuje intensywne łuszczenie płatowe ani sączenie tkanek.",
        category: "Rekonwalescencja"
      },
      {
        question: "Ile zabiegów w serii warto wykonać?",
        answer: "Zabieg można wykonać jednorazowo w celu natychmiastowego wygładzenia i rozświetlenia cery lub w serii 3–4 zabiegów w odstępach 10–14 dni. Pakiet 3 zabiegów pozwala na systematyczną pracę nad strukturą i kolorytem naskórka.",
        category: "Seria"
      },
      {
        question: "Jak kształtuje się cennik pojedynczych wizyt i pakietów 3 zabiegów?",
        answer: "Ceny pojedynczych zabiegów: Twarz – 350 zł | Twarz i szyja – 400 zł | Twarz, szyja i dekolt – 450 zł. Pakiety 3 zabiegów (10% rabatu): Twarz (pakiet 3) – 945 zł (315 zł/zabieg) | Twarz i szyja (pakiet 3) – 1080 zł (360 zł/zabieg) | Twarz, szyja i dekolt (pakiet 3) – 1215 zł (405 zł/zabieg).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "mezoterapia-beziglowa",
    title: "Mezoterapia Bezigłowa",
    subtitle: "Bez nakłuwania • Indywidualnie dobrane koncentraty dermaviduals® • Wsparcie kondycji skóry",
    duration: "60 — 90 minut",
    price: "400 PLN — 500 PLN (Pakiety 3 zabiegów od 1080 PLN)",
    description: "Nieinwazyjna metoda wspomagająca przenikanie odpowiednio dobranych substancji aktywnych bez naruszania ciągłości naskórka. Wykorzystuje kontrolowane impulsy elektryczne (elektroporację), które czasowo zwiększają przepuszczalność powierzchownych struktur skóry i ułatwiają transport składników. Podczas wizyty dobierana jest unikalna baza oraz koncentraty aktywne dermaviduals® tworzone bezpośrednio przy klientce po rzetelnej analizie bariery, nawodnienia i reaktywności.",
    focus: "Elektroporacja bezigłowa, koncentraty dermaviduals®, brak nakłuwania, zero rekonwalescencji, odbudowa bariery",
    image: "/src/assets/images/mezoterapia_beziglowa.webp",
    indications: [
      "Odwodnienie i uczucie ściągnięcia, szorstkości lub dyskomfortu naskórka",
      "Utrata świeżości, szary koloryt i brak naturalnego blasku",
      "Nierównomierny koloryt i zmęczony wygląd cery",
      "Pierwsze oznaki starzenia oraz spadek elastyczności tkanek",
      "Skóra zmęczona, narażona na stres oksydacyjny i ekspozom",
      "Osłabiona kondycja bariery naskórkowej (zaburzony płaszcz hydrolipidowy)",
      "Potrzeba intensywnego wsparcia przy braku gotowości na mikronakłuwanie",
      "Osoby preferujące procedury całkowicie bezinwazyjne i bezbolesne"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Wszczepiony rozrusznik serca oraz inne implanty i urządzenia elektroniczne",
      "Padaczka (epilepsja)",
      "Aktywna choroba nowotworowa",
      "Aktywne infekcje bakteryjne, wirusowe (opryszczka) i grzybicze",
      "Otwarte rany i przerwanie ciągłości naskórka",
      "Zaburzenia czucia w obszarze zabiegowym",
      "Metalowe implanty znajdujące się bezpośrednio w obszarze działania",
      "Alergia na składniki stosowanych koncentratów"
    ],
    postTreatmentCare: [
      "Stosowanie indywidualnie dobranej pielęgnacji barierowej zaleconej w gabinecie",
      "Codzienna fotoprotekcja preparatem z wysokim filtrem SPF 50+",
      "Powstrzymanie się od wprowadzania nowych, niesprawdzonych kosmetyków",
      "Czasowa rezygnacja z silnych kwasów, retinoidów i peelingów ziarnistych przez 3–5 dni",
      "Unikanie intensywnego przegrzewania (sauna, łaźnia, gorące kąpiele) przez 48h",
      "Niewykonywanie innych intensywnych procedur bez wcześniejszej konsultacji"
    ],
    activeSubstances: [
      "Indywidualnie dobrane koncentraty czystych substancji dermaviduals®",
      "Kwas hialuronowy o niskiej masie i bio-składniki NMF",
      "Czysta ektoina, beta-glukan, d-pantenol i alantoina wyciszające podrażnienia",
      "Kompleksy peptydowe, aminokwasy i kofaktory regeneracyjne",
      "Lipidy bionomiczne DMS (Derma Membrane Structure) identyczne ze skórą"
    ],
    protocolSteps: [
      { phase: "I — Analiza Skóry", description: "Szczegółowa ocena bariery naskórkowej, poziomu nawodnienia, reaktywności, kolorytu oraz tolerancji dotychczasowej pielęgnacji." },
      { phase: "II — Przygotowanie Naskórka", description: "Delikatne oczyszczenie i przygotowanie powierzchni skóry bez agresywnego złuszczania i naruszania płaszcza lipidowego." },
      { phase: "III — Dobór Składników Aktywnych", description: "Wybór odpowiedniej bazy DMS i koncentratów dermaviduals® tworzonych bezpośrednio przy klientce." },
      { phase: "IV — Mezoterapia Bezigłowa", description: "Aplikacja kompozycji oraz praca głowicą z indywidualnie ustawionymi impulsami elektrycznymi." },
      { phase: "V — Wyciszenie i Ochrona", description: "Aplikacja pielęgnacji wspierającej nawodnienie, komfort, regenerację bariery oraz fotoprotekcja SPF 50+." }
    ],
    faq: [
      {
        question: "Czym różni się mezoterapia bezigłowa od igłowej i mikroigłowej?",
        answer: "Mezoterapia bezigłowa nie wykorzystuje żadnych igieł, nie przerywa ciągłości naskórka i nie powoduje krwawienia ani mikrourazów. Zamiast nakłuć wykorzystuje zjawisko elektroporacji – kontrolowane impulsy prądu, które czasowo rozszczelniają mikrokanały w błonach komórkowych naskórka, umożliwiając wnikanie składników aktywnych.",
        category: "Metoda"
      },
      {
        question: "Dlaczego składniki dermaviduals® są dobierane przy klientce?",
        answer: "W Slow Skin Concept™ nie wierzymy w uniwersalne gotowe ampułki. Każda skóra ma inną grubość naskórka, inny stopień ucieczki wody i inny poziom reaktywności. Formuła koncentratów aktywnych dermaviduals® powstaje na żywo podczas wizyty, ściśle odpowiadając na aktualne potrzeby biologiczne cery.",
        category: "Składniki"
      },
      {
        question: "Czy po zabiegu wymagana jest rekonwalescencja?",
        answer: "Nie, zabieg jest komfortowy i bezurazowy. Może pojawić się jedynie chwilowe, delikatne zaróżowienie przy cerach naczyniowych lub wybitnie reaktywnych, które szybko ustępuje.",
        category: "Rekonwalescencja"
      },
      {
        question: "Ile zabiegów w serii warto wykonać?",
        answer: "Pojedyncza wizyta daje natychmiastowe odświeżenie i komfort. Dla utrwalonej poprawy bariery i głębokiego nawodnienia zalecana jest seria 3 zabiegów powtarzanych co 10–14 dni w promocyjnym pakiecie.",
        category: "Seria"
      },
      {
        question: "Jak kształtuje się cennik pojedynczych wizyt i pakietu 3 zabiegów?",
        answer: "Pojedyncze wizyty: Twarz (60 min) – 400 zł | Twarz i szyja (60–75 min) – 450 zł | Twarz, szyja i dekolt (75–90 min) – 500 zł. Pakiety 3 zabiegów (rabat 10%): Twarz – 1080 zł (zamiast 1200 zł) | Twarz i szyja – 1215 zł (zamiast 1350 zł) | Twarz, szyja i dekolt – 1350 zł (zamiast 1500 zł).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "mezoterapia-mikroiglowa",
    title: "Mezoterapia Mikroigłowa",
    subtitle: "Kontrolowana stymulacja • Przebudowa struktury skóry • Indywidualnie dobrany preparat",
    duration: "75 — 90 minut",
    price: "500 PLN — 700 PLN (Pakiety 3 zabiegów od 1350 PLN)",
    description: "Precyzyjny zabieg kontrolowanego mikronakłuwania sterylnym kartridżem, który uruchamia naturalne procesy naprawcze, kaskadę gojenia i biologiczną przebudowę macierzy zewnątrzkomórkowej. Wspiera syntezę kolagenu i elastyny, poprawia gęstość i jędrność oraz zmniejsza widoczność rozszerzonych porów, drobnych zmarszczek i blizn potrądzikowych. Głębokość wkłuć i skład jałowego preparatu są dobierane indywidualnie po uprzedniej ocenie gotowości biologicznej skóry.",
    focus: "Fizjologiczna indukcja kolagenu, sterylny kartridż jednorazowy, spersonalizowany preparat, przebudowa strukturalna",
    image: "/src/assets/images/mezoterapia_mikroiglowa.webp",
    indications: [
      "Utrata jędrności, gęstości, elastyczności i napięcia skóry",
      "Drobne zmarszczki mimiczne i utrwalone linie",
      "Rozszerzone pory, szorstkość i nierówna struktura tkanek",
      "Blizny potrądzikowe (po wygaszeniu aktywnej fazy zapalnej)",
      "Nierównomierny koloryt i powierzchowne przebarwienia posłoneczne",
      "Oznaki fotostarzenia i wiotkość skóry",
      "Skóra dojrzała wymagająca intensywniejszej stymulacji regeneracyjnej"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywne infekcje skóry bakteryjne, wirusowe (opryszczka) i grzybicze",
      "Aktywny, nasilony trądzik zapalny ze zmianami krostkowymi i ropnymi",
      "Zaostrzenie dermatoz zapalnych (łuszczyca, AZS, trądzik różowaty)",
      "Skłonność do tworzenia bliznowców i keloidów",
      "Zaburzenia krzepnięcia krwi i przyjmowanie leków przeciwzakrzepowych",
      "Aktywna choroba nowotworowa",
      "Świeża opalenizna oraz niedawne agresywne procedury w obszarze zabiegowym"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej pielęgnacji barierowej zaleconej w gabinecie",
      "Zachowanie bezwzględnej higieny: zmiana poszewki na czystą, niedotykanie twarzy rękami",
      "Unikanie kwasów, retinoidów, witaminy C i kosmetyków drażniących przez 5–7 dni",
      "Rezygnacja z sauny, basenu, gorących kąpieli i intensywnego wysiłku przez 3–4 dni",
      "Całkowite unikanie ekspozycji na słońce i solarium",
      "Codzienne stosowanie mineralnego kremu ochronnego SPF 50+",
      "Bezwzględny zakaz samodzielnego usuwania czy zdrapywania łuszczącego się naskórka"
    ],
    activeSubstances: [
      "Nieusieciowany kwas hialuronowy o czystości farmaceutycznej",
      "Kompleksy biozgodnych aminokwasów i peptydów biomimetycznych",
      "Kofaktory syntezy kolagenu i antyoksydanty",
      "Jałowe preparaty łagodzące i wspierające regenerację pozabiegową"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Ocena Gotowości", description: "Szczegółowy wywiad, weryfikacja wskazań i bariery. Kwalifikacja wyłącznie przy gotowości biologicznej tkanek." },
      { phase: "II — Przygotowanie i Aseptyka", description: "Rygorystyczne oczyszczenie i dezynfekcja obszaru zgodnie ze standardami procedury inwazyjnej." },
      { phase: "III — Kontrolowane Mikronakłuwanie", description: "Praca sterylnym, jednorazowym kartridżem na indywidualnie dobranej głębokości (od 0.25 do 2.0 mm) i prędkości." },
      { phase: "IV — Aplikacja Jałowego Preparatu", description: "Równomierne wprowadzenie dedykowanego koktajlu regeneracyjnego, peptydowego lub nawilżającego." },
      { phase: "V — Wyciszenie i Ochrona Bariery", description: "Aplikacja jałowej maski/emulsji kojącej, kompres regeneracyjny oraz filtr mineralny SPF 50+." }
    ],
    faq: [
      {
        question: "Czy mezoterapia mikroigłowa jest bolesna?",
        answer: "Zabieg wiąże się z odczuciem drapania lub mrowienia. W Slow Skin Concept™ dobieramy parametry tak, aby wywołać pożądaną stymulację biologiczną bez niepotrzebnego bólu i traumatyzacji. W razie potrzeby stosujemy preparat znieczulający.",
        category: "Komfort"
      },
      {
        question: "Jak skóra wygląda po zabiegu i jak długo trwa rekonwalescencja?",
        answer: "Bezpośrednio po zabiegu skóra jest zaczerwieniona, cieplejsza i lekko napięta (przypomina lekkie oparzenie słoneczne). Zaczerwienienie wycisza się w ciągu 24–48 godzin. Po 3–4 dniach może pojawić się delikatne, drobnopłatkowe złuszczanie naskórka.",
        category: "Rekonwalescencja"
      },
      {
        question: "Kiedy widać efekty i ile zabiegów potrzeba?",
        answer: "Pierwsze wygładzenie i poprawa napięcia są widoczne po wyciszeniu skóry, jednak zasadnicza przebudowa kolagenowa trwa od 4 do 12 tygodni. Rekomendujemy serię 3–4 zabiegów w odstępach 4–6 tygodni.",
        category: "Efekty"
      },
      {
        question: "Czym różni się pakiet 3 zabiegów od pojedynczych wizyt?",
        answer: "Pakiet 3 zabiegów zapewnia 10% rabatu oraz indywidualną ewolucję terapii: podczas każdej kolejnej wizyty oceniamy stopień przebudowy i możemy zwiększyć głębokość wkłuć lub zmienić kompozycję preparatu.",
        category: "Pakiety"
      },
      {
        question: "Jak kształtuje się cennik mikronakłuwania?",
        answer: "Pojedyncza wizyta: Twarz – 500 zł | Twarz i szyja – 600 zł | Twarz, szyja i dekolt – 700 zł. Pakiety 3 zabiegów: Twarz – 1350 zł (450 zł/zabieg) | Twarz i szyja – 1620 zł (540 zł/zabieg) | Twarz, szyja i dekolt – 1890 zł (630 zł/zabieg).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "mesoporacja-dwufazowa-mesoporo",
    title: "Mesoporacja Dwufazowa MESO PORO",
    subtitle: "Złota głowica ESM • Bezigłowa aplikacja składników aktywnych • Indywidualna terapia skóry",
    duration: "60 — 75 minut",
    price: "450 PLN — 550 PLN (Pakiety 4 i 6 zabiegów z rabatem do 15%)",
    description: "Innowacyjna, bezinwazyjna terapia łącząca dwa komplementarne etapy podczas jednej wizyty: przygotowanie i stymulację mikrokrążenia za pomocą luksusowej złotej głowicy ESM oraz bezigłową aplikację wyselekcjonowanych substancji aktywnych głowicą MESO PORO. Czasowe zwiększenie przepuszczalności naskórka pozwala na dogłębne nasycenie tkanek kwasem hialuronowym, peptydami, ektoiną i składnikami barierowymi bez naruszania ciągłości skóry i bez okresu rekonwalescencji.",
    focus: "Złota głowica rolkowa ESM, impulsy MESO PORO, bezbolesny elektroporacyjny transport składników, natychmiastowe napięcie i nawodnienie",
    image: "/src/assets/images/meso_poro_gold.webp",
    indications: [
      "Skóra odwodniona, sucha, szorstka lub pozbawiona komfortu",
      "Cera zmęczona, ziemista, matowa i pozbawiona świeżości",
      "Wiotkość tkanek i potrzeba poprawy napięcia owalu",
      "Nierówna struktura naskórka i zaburzony koloryt",
      "Ekspozycja na stres oksydacyjny, smog i czynniki środowiskowe",
      "Cera reaktywna i naczyniowa, gotowa na delikatną stymulację aparaturową",
      "Potrzeba intensywnej regeneracji bez nakłuwania igłami i bez rekonwalescencji",
      "Zabieg bankietowy przygotowujący skórę do ważnego wydarzenia"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Wszczepiony rozrusznik serca i inne elektroniczne implanty",
      "Metalowe implanty bezpośrednio w obszarze zabiegowym",
      "Aktywna choroba nowotworowa",
      "Padaczka (epilepsja)",
      "Aktywne infekcje wirusowe (opryszczka) i bakteryjne stany zapalne",
      "Otwarte rany i przerwanie ciągłości naskórka",
      "Zaburzenia czucia w obszarze zabiegowym",
      "Alergia na składniki stosowanego preparatu"
    ],
    postTreatmentCare: [
      "Pielęgnacja domowa wspierająca barierę naskórkową według wskazań kosmetologa",
      "Ochrona przeciwsłoneczna preparatem SPF 50+",
      "Unikanie intensywnego wysiłku, sauny i chlorowanego basenu przez 24 godziny",
      "Picie odpowiedniej ilości wody dla podtrzymania efektu nawodnienia"
    ],
    activeSubstances: [
      "Kwas hialuronowy o zróżnicowanej masie cząsteczkowej i NMF",
      "Ektoina, beta-glukan, pantenol kojące nadreaktywność",
      "Biomimetyczne peptydy sygnałowe i aminokwasy wspierające gęstość",
      "Niacynamid, N-acetyloglukozamina (NAG) i silne antyoksydanty",
      "Bionomiczne nośniki lipidowe wzmacniające barierę"
    ],
    protocolSteps: [
      { phase: "1. Ocena i Przygotowanie Skóry", description: "Szczegółowy wywiad, analiza poziomu nawodnienia, kondycji bariery, reaktywności oraz dokładne oczyszczenie barierowe." },
      { phase: "2. Przygotowanie Złotą Głowicą ESM", description: "Masaż stymulujący mikrokrążenie, rozluźniający napięcia powięziowe i zwiększający responsywność tkanek." },
      { phase: "3. Indywidualny Dobór Preparatu", description: "Komponowanie formuły substancji aktywnych bezpośrednio odpowiadających priorytetom skóry." },
      { phase: "4. Mesoporacja Głowicą MESO PORO", description: "Aplikacja koncentratu i impulsowe wprowadzenie cząsteczek bez naruszania ciągłości naskórka." },
      { phase: "5. Wyciszenie i Fotoprotekcja", description: "Aplikacja emulsji barierowej oraz szerokopasmowej ochrony mineralnej SPF 50+." }
    ],
    faq: [
      {
        question: "Na czym polega działanie Złotej Głowicy ESM?",
        answer: "Złota głowica rolkowa ESM łączy delikatny mikromasaż mechaniczny ze stymulacją mikrokrążenia. Dotlenia komórki skóry, rozluźnia napięcia mięśni mimicznych i optymalizuje stan tkanek, dzięki czemu w drugim etapie głowica MESO PORO może wprowadzić substancje aktywne znacznie głębiej i równomierniej.",
        category: "Technologia"
      },
      {
        question: "Czy Mesoporacja boli?",
        answer: "Zabieg jest całkowicie bezbolesny i wysoce relaksujący. Podczas pracy głowicy odczuwalne jest jedynie przyjemne mrowienie lub delikatne wibracje. Brak igieł oznacza brak uszkodzeń naskórka, brak krwi i brak obrzęków.",
        category: "Komfort"
      },
      {
        question: "Ile zabiegów w serii przynosi optymalne efekty?",
        answer: "Rekomendowana seria to zazwyczaj 4 do 6 zabiegów wykonywanych raz w tygodniu. Po zakończeniu serii zaleca się sesję przypominającą co 8–10 tygodni dla utrwalenia nawodnienia i jędrności.",
        category: "Seria"
      },
      {
        question: "Jakie rabaty obejmują pakiety 4 i 6 zabiegów?",
        answer: "Pakiet 4 zabiegów zapewnia 10% rabatu, a pakiet 6 zabiegów aż 15% rabatu. Każda wizyta w pakiecie obejmuje pracę obiema głowicami oraz ponowną ocenę kondycji cery z dopasowaniem ampułki.",
        category: "Pakiety"
      },
      {
        question: "Jak wygląda cennik pojedynczych wizyt i pakietów?",
        answer: "Jeden zabieg: Twarz (450 zł) | Twarz i szyja (500 zł) | Twarz, szyja i dekolt (550 zł). Pakiet 4 zabiegów (-10%): Twarz (1620 zł) | Twarz i szyja (1800 zł) | Twarz, szyja i dekolt (1980 zł). Pakiet 6 zabiegów (-15%): Twarz (2295 zł) | Twarz i szyja (2550 zł) | Twarz, szyja i dekolt (2805 zł).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "hifu-ultrasound",
    title: "HIFU — Lifting Ultradźwiękowy",
    subtitle: "Skoncentrowane ultradźwięki • Poprawa napięcia • Modelowanie owalu",
    duration: "około 60–90 minut",
    price: "600 PLN — 800 PLN",
    description: "HIFU wykorzystuje skoncentrowane fale ultradźwiękowe, które dostarczają energię na określoną głębokość tkanek bez naruszania powierzchni skóry. Kontrolowane punkty termiczne uruchamiają procesy przebudowy, których rezultaty rozwijają się stopniowo w kolejnych tygodniach. Zabieg poprzedza kwalifikacja obejmująca ocenę kondycji skóry, grubości tkanki, anatomii obszaru oraz przeciwwskazań. Parametry i głębokość działania dobierane są indywidualnie — HIFU nie wykonuje się według jednego schematu u każdej osoby.",
    focus: "Skoncentrowana fala ultradźwiękowa, punkty koagulacji termicznej, lifting i poprawa konturu żuchwy bez naruszania naskórka",
    image: "/src/assets/images/hifu_ultrasound.webp",
    indications: [
      "Utrata napięcia skóry twarzy i szyi",
      "Mniej wyraźny owal twarzy i opadanie tkanek w okolicy policzków",
      "Utrata wyrazistości linii żuchwy (tzw. chomiki)",
      "Wiotkość skóry szyi i dekoltu",
      "Oczekiwanie stopniowego efektu ujędrnienia bez procedury chirurgicznej"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywne infekcje i stany zapalne w obszarze zabiegowym",
      "Niektóre choroby ogólnoustrojowe i zaburzenia gojenia",
      "Zaburzenia czucia w obszarze poddawanym procedurze",
      "Implanty metalowe lub urządzenia elektroniczne (rozrusznik serca)",
      "Określone wcześniejsze inwazyjne procedury estetyczne w danym polu"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej pielęgnacji wspierającej barierę naskórkową",
      "Codzienna ochrona przeciwsłoneczna preparatami z wysokim filtrem",
      "Unikanie intensywnego rozgrzewania oraz masowania obszaru zgodnie z zaleceniami",
      "Niewykonywanie innych intensywnych procedur bez wcześniejszego uzgodnienia",
      "Obserwowanie reakcji skóry i zgłoszenie ewentualnych nietypowych dolegliwości"
    ],
    activeSubstances: [
      "Skoncentrowana wiązka ultradźwięków wysokiej częstotliwości (High-Intensity Focused Ultrasound)",
      "Bionomiczny żel sprzęgający oraz formuły wyciszające barierę naskórkową"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Kwalifikacja", description: "Ocena wskazań, przeciwwskazań, grubości tkanki tłuszczowej, anatomii obszaru oraz realnych możliwości uzyskania rezultatu." },
      { phase: "II — Wyznaczenie Obszaru Działania", description: "Precyzyjne zaplanowanie wektorów zabiegu oraz dobór odpowiednich przetworników i głębokości (np. 1.5 mm, 3.0 mm, 4.5 mm)." },
      { phase: "III — Aplikacja Ultradźwięków", description: "Precyzyjne wykonanie impulsów w zaplanowanych strefach ze stałą kontrolą komfortu i reakcji tkanek." },
      { phase: "IV — Ochrona Skóry", description: "Usunięcie żelu przewodzącego i zastosowanie pielęgnacji wspierającej komfort oraz barierę naskórkową." }
    ],
    faq: [
      {
        question: "Kiedy widać rezultaty zabiegu HIFU?",
        answer: "Po zabiegu może nastąpić stopniowa poprawa napięcia skóry, wyraźniejszy kontur twarzy i zmniejszenie widoczności wiotkości. Efekt nie pojawia się natychmiast — rozwija się wraz z przebudową tkanki i neokolagenezą w kolejnych tygodniach i może być różny u poszczególnych osób.",
        category: "Efekty"
      },
      {
        question: "Czy HIFU to odpowiednik chirurgicznego liftingu twarzy?",
        answer: "Nie należy traktować HIFU jako zamiennika operacji chirurgicznej („liftingu bez skalpela”). Technologia może wyraźnie poprawić napięcie i kontur, ale zakres rezultatu zależy od anatomii, stopnia wiotkości, wieku biologicznego tkanek oraz indywidualnej odpowiedzi organizmu.",
        category: "Uczciwe fakty"
      },
      {
        question: "Czy HIFU nawilża lub poprawia koloryt cery?",
        answer: "HIFU nie jest zabiegiem przeznaczonym do poprawiania nawodnienia, kolorytu ani kondycji bariery naskórkowej. Jeżeli skóra wymaga najpierw nawodnienia, wyciszenia rumienia lub regeneracji bariery, procedury te włączamy w pierwszej kolejności, a HIFU planujemy na kolejnym etapie.",
        category: "Kwalifikacja"
      },
      {
        question: "Jak wygląda okres rekonwalescencji po zabiegu?",
        answer: "Powierzchnia skóry pozostaje nienaruszona, dlatego zabieg zwykle nie wymaga okresu rekonwalescencji typowego dla procedur naruszających naskórek. Może wystąpić przejściowa tkliwość głębszych tkanek, delikatne zaróżowienie lub niewielki obrzęk, które samoistnie ustępują.",
        category: "Rekonwalescencja"
      }
    ]
  },
  {
    id: "rf-microneedling",
    title: "Radiofrekwencja Mikroigłowa",
    subtitle: "Mikronakłuwanie • Energia RF • Poprawa napięcia i struktury skóry",
    duration: "około 90 minut",
    price: "500 PLN — 700 PLN",
    description: "Zaawansowana technologia łącząca kontrolowane mikronakłuwanie z działaniem energii fali radiowej. Sterylne mikroigły docierają na indywidualnie dobraną głębokość, a następnie przekazują energię RF bezpośrednio do wybranej warstwy tkanki. Mikronakłucia inicjują naturalną odpowiedź naprawczą, natomiast energia radiowa powoduje kontrolowane ogrzanie tkanki. Połączenie tych dwóch bodźców wspiera procesy związane z produkcją kolagenu i elastyny oraz stopniową przebudowę skóry.",
    focus: "Frakcyjna stymulacja kolagenu, termolifting falami RF, redukcja rozszerzonych porów, spłycenie drobnych zmarszczek i blizn",
    image: "/src/assets/images/rf_microneedle.webp",
    indications: [
      "Utrata jędrności, gęstości i napięcia skóry twarzy, szyi lub dekoltu",
      "Drobne zmarszczki i utrata elastyczności",
      "Nierówna struktura skóry oraz rozszerzone ujścia mieszków włosowych (pory)",
      "Blizny potrądzikowe i nierówności potraumatyczne",
      "Wiotkość skóry twarzy, podbródka, szyi i dekoltu",
      "Chęć poprawy ogólnej gęstości i jakości tkanki",
      "Rozstępy i blizny w innych partiach ciała"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywne infekcje i stany zapalne skóry (bakteryjne, wirusowe, grzybicze)",
      "Przerwanie ciągłości naskórka w obszarze zabiegowym",
      "Zaburzenia gojenia i skłonność do tworzenia bliznowców (keloidów)",
      "Aktywna choroba nowotworowa",
      "Niektóre choroby autoimmunologiczne i ogólnoustrojowe",
      "Zaburzenia krzepnięcia lub stosowanie określonych leków przeciwkrzepliwych",
      "Rozrusznik serca i wybrane aktywne urządzenia elektroniczne",
      "Metalowe elementy znajdujące się w obszarze zabiegowym",
      "Świeża opalenizna lub niedawno wykonane intensywne procedury estetyczne"
    ],
    postTreatmentCare: [
      "Stosowanie wyłącznie zaleconej, łagodnej pielęgnacji barierowej",
      "Codzienna fotoprotekcja preparatami z wysokim filtrem mineralnym SPF 50+",
      "Czasowa rezygnacja z retinoidów, kwasów, peelingów i produktów drażniących",
      "Unikanie sauny, basenu, intensywnego wysiłku i przegrzewania skóry przez wskazany okres",
      "Rezygnacja z makijażu przez czas zalecony podczas wizyty",
      "Bezwzględne nieusuwanie powstających strupków ani złuszczającego się naskórka",
      "Niewykonywanie innych intensywnych procedur bez wcześniejszej konsultacji"
    ],
    activeSubstances: [
      "Sterylne mikroigły przewodzące falę radiową bipolarną/monopolarną",
      "Specjalistyczne preparaty łagodzące i barierowe przeznaczone do skóry po mikronakłuwaniu"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Kwalifikacja", description: "Ocena wskazań, przeciwwskazań, kondycji skóry, reaktywności, zdolności do gojenia oraz obszaru kwalifikowanego do procedury." },
      { phase: "II — Przygotowanie Obszaru Zabiegowego", description: "Dokładne oczyszczenie i antyseptyka skóry zgodnie z zasadami procedury; w razie potrzeby aplikacja miejscowego preparatu znieczulającego." },
      { phase: "III — Radiofrekwencja Mikroigłowa", description: "Głowica ze sterylnym kartridżem wykonuje kontrolowane nakłucia z bezpośrednią emisją fali RF na ustaloną głębokość (indywidualne parametry energii i czasu impulsu)." },
      { phase: "IV — Ochrona Pozabiegowa", description: "Aplikacja preparatu pozabiegowego wspierającego natychmiastowe ukojenie, komfort i optymalne środowisko biologiczne do regeneracji." }
    ],
    faq: [
      {
        question: "Dlaczego parametry RF mikroigłowej muszą być dobierane indywidualnie?",
        answer: "Głębokość nakłuć, poziom energii fali radiowej, liczba impulsów i sposób prowadzenia głowicy zależą od grubości skóry, fototypu oraz celu zabiegu. Innych ustawień wymaga delikatna skóra twarzy i powiek, a innych terapia głębszych blizn potrądzikowych czy rozstępów.",
        category: "Parametry"
      },
      {
        question: "Kiedy widać rezultaty i ile zabiegów w serii zaplanować?",
        answer: "Przebudowa kolagenowa i poprawa gęstości rozwijają się stopniowo w kolejnych tygodniach. W niektórych przypadkach wystarczający może być pojedynczy zabieg, natomiast przy bliznach, rozstępach lub większej wiotkości planowana jest seria 3–4 zabiegów ustalana po pierwszej wizycie.",
        category: "Efekty"
      },
      {
        question: "Jak wygląda skóra bezpośrednio po radiofrekwencji mikroigłowej?",
        answer: "Po zabiegu może wystąpić zaczerwienienie, uczucie ciepła, niewielki obrzęk, tkliwość lub punktowe ślady po wkłuciach. W kolejnych dniach skóra może być bardziej sucha, napięta i delikatnie się złuszczać. Reakcje te są naturalnym elementem indukcji naprawczej.",
        category: "Rekonwalescencja"
      },
      {
        question: "Czy do zabiegu trzeba wcześniej przygotować skórę?",
        answer: "Tak. Jeżeli bariera naskórkowa jest osłabiona, występuje aktywny stan zapalny lub nadmierna reaktywność naczyniowa, pierwszym krokiem jest przywrócenie równowagi fizjologicznej. Dopiero po uzyskaniu gotowości tkanek przystępujemy do procedury.",
        category: "Przygotowanie"
      }
    ]
  },
  {
    id: "neurolifting-face",
    title: "Neurolifting — Elektrostymulacja Mięśniowo-Powięziowa Twarzy",
    subtitle: "Częstotliwości Nogiera • Precyzyjna elektrostymulacja • Praca z mięśniami i powięzią",
    duration: "około 45–60 minut",
    price: "Cena ustalana podczas kwalifikacji mięśniowo-powięziowej",
    description: "Specjalistyczny zabieg kosmetologiczny łączący precyzyjną elektrostymulację za pomocą cienkich, jednorazowych igieł z pracą nad układem mięśniowo-powięziowym twarzy. Podczas zabiegu wykorzystywane są programy impulsowe oparte na częstotliwościach Nogiera. Rozmieszczenie igieł, rodzaj częstotliwości, intensywność impulsów oraz czas stymulacji dobierane są indywidualnie po ocenie mimiki, symetrii i napięcia tkanek. Celem jest przywrócenie równowagi pomiędzy obszarami osłabionymi i nadmiernie spiętymi.",
    focus: "Elektrostymulacja igłowa, częstotliwości Nogiera, tonizacja powięziowa, modelowanie owalu i uniesienie tkanek bez zamrażania mimiki",
    image: "/src/assets/images/neurolifting_face.webp",
    indications: [
      "Utrata napięcia i wyrazistości owalu twarzy",
      "Opadanie tkanek policzków lub kącików ust",
      "Widoczna asymetria napięcia mięśniowego twarzy",
      "Utrwalone napięcia mimiczne (czoło, lwia zmarszczka, żwacze, żuchwa)",
      "Napięty, zmęczony wyraz twarzy",
      "Chęć naturalnej poprawy ułożenia tkanek bez sztucznego zwiększania ich objętości (wolumetrii)",
      "Element całościowego programu modelowania struktury twarzy"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Wszczepiony rozrusznik serca i inne aktywne implanty elektroniczne",
      "Padaczka (epilepsja)",
      "Aktywna choroba nowotworowa",
      "Zaburzenia krzepnięcia lub stosowanie określonych leków przeciwzakrzepowych",
      "Aktywne infekcje bakteryjne, wirusowe i stany zapalne skóry",
      "Przerwanie ciągłości naskórka w obszarze zabiegowym",
      "Zaburzenia czucia w obrębie twarzy",
      "Niektóre choroby neurologiczne i ogólnoustrojowe"
    ],
    postTreatmentCare: [
      "Zachowanie łagodnej pielęgnacji barierowej w dniu zabiegu",
      "Unikanie dotykania miejsc wkłucia nieumytymi rękami",
      "Rezygnacja z intensywnego masażu i innych procedur aparaturowych w tym samym dniu",
      "Unikanie sauny, basenu i intensywnego wysiłku fizycznego przez wskazany okres",
      "Codzienna fotoprotekcja mineralna"
    ],
    activeSubstances: [
      "Precyzyjne impulsy mikroprądowe oparte na biologicznych częstotliwościach Paula Nogiera",
      "Sterylne jednorazowe mikroigły akupunkturowe",
      "Preparaty bionomiczne wspierające komfort i barierę naskórkową"
    ],
    protocolSteps: [
      { phase: "I — Analiza Mięśniowo-Powięziowa", description: "Szczegółowa ocena mimiki, symetrii, zarysowania owalu oraz identyfikacja stref osłabienia i nadmiernego napięcia mięśniowego." },
      { phase: "II — Przygotowanie Skóry", description: "Dokładne oczyszczenie i antyseptyka obszaru twarzy zgodnie z rygorystyczną procedurą pracy z igłami." },
      { phase: "III — Indywidualne Rozmieszczenie Igieł", description: "Cienkie, jednorazowe igły umieszczane są w precyzyjnych punktach anatomicznych dobranych do indywidualnego układu napięć." },
      { phase: "IV — Elektrostymulacja Częstotliwościami Nogiera", description: "Przekazanie do igieł impulsów o spersonalizowanej częstotliwości i intensywności, dostosowywanych do reakcji tkanek i odczuć klientki." },
      { phase: "V — Integracja Mięśniowo-Powięziowa", description: "Zależnie od potrzeb uzupełnienie zabiegu technikami manualnymi wspierającymi rozluźnienie spięć i harmonijną współpracę tkanek." },
      { phase: "VI — Wyciszenie i Pielęgnacja Skóry", description: "Bezpieczne usunięcie igieł, ocena reakcji tkanek i zastosowanie pielęgnacji kojącej barierę naskórkową." }
    ],
    faq: [
      {
        question: "Czym są częstotliwości Nogiera w neuroliftingu?",
        answer: "To programy impulsowe oparte na zakresach częstotliwości opisanych przez francuskiego lekarza Paula Nogiera. Pozwalają one różnicować charakter elektrostymulacji i dopasowywać ją do pracy z mięśniami lub powięzią. Nie oznacza to leczenia układu nerwowego ani regeneracji nerwów — częstotliwości stanowią zaawansowane narzędzie techniczne prowadzenia bezpiecznej elektrostymulacji kosmetologicznej.",
        category: "Technologia"
      },
      {
        question: "Czy neurolifting zamraża mimikę jak botoks?",
        answer: "Absolutnie nie. Neurolifting nie poraża mięśni ani nie odbiera naturalnej ekspresji. Jego celem jest przywrócenie balansu pomiędzy mięśniami nadmiernie spiętymi a osłabionymi, co daje efekt wypoczętej, naturalnie uniesionej twarzy o pełnej, żywej mimice.",
        category: "Efekty"
      },
      {
        question: "Czy zabieg jest bolesny i czy zostawia ślady?",
        answer: "Stosowane są ultra cienkie, jednorazowe igły akupunkturowe. Ich wprowadzenie jest zazwyczaj niemal nieodczuwalne, a impulsy elektryczne dają uczucie delikatnego mrowienia lub rytmicznego pulsowania. W miejscach wkłucia może pojawić się chwilowe zaczerwienienie lub sporadycznie małe zasinienie, które szybko ustępują.",
        category: "Komfort"
      },
      {
        question: "Czy neurolifting zastępuje lifting chirurgiczny lub wypełniacze?",
        answer: "Neurolifting nie zastępuje chirurgii plastycznej ani wolumetrii tkankowej. Koncentruje się na fizjologicznej pracy z napięciem mięśniowo-powięziowym i naturalną dynamiką twarzy, dając naturalną poprawę konturu i wypoczęty wygląd.",
        category: "Uczciwe fakty"
      }
    ]
  },
  {
    id: "epigenetic-aging",
    title: "Slow Aging — Odnowa i Wygładzenie",
    subtitle: "Pielęgnacja wspierająca naturalną witalność i młodość cery",
    duration: "90 minut",
    price: "480 PLN — 600 PLN",
    description: "Troskliwy zabieg rewitalizujący, który dostarcza skórze składników odżywczych, peptydów i antyoksydantów. Wspomaga naturalną zdolność cery do regeneracji, poprawia nawilżenie i elastyczność oraz chroni przed oznakami przedwczesnego starzenia spowodowanego stresem i zanieczyszczeniami.",
    focus: "Ochrona antyoksydacyjna, wygładzenie drobnych zmarszczek, głęboka regeneracja",
    image: "/src/assets/images/meso_remodeling_card_1786128520065.jpg",
    indications: [
      "Widoczne oznaki starzenia chronologicznego i fotostarzenia",
      "Utrata blasku, suchość głęboka, drobne i głębokie zmarszczki",
      "Skóra narażona na ekspozom (smog, stres miejski, promieniowanie UV/HEV)"
    ],
    contraindications: [
      "Ciąża i laktacja, infekcje skórne, choroby nowotworowe",
      "Alergia na składniki koktajli epigenetycznych"
    ],
    postTreatmentCare: [
      "Stosowanie domowych aktywatorów epigenetycznych według Beauty Planu",
      "Codzienna ochrona przeciwsłoneczna SPF 50+",
      "Odpowiednia ilość snu i dieta bogata w antyoksydanty"
    ],
    activeSubstances: [
      "Kompleksy peptydowe chroniące telomery",
      "Ekstrakt z komórek macierzystych jabłoni szwajcarskiej",
      "Kwas bursztynowy, resweratrol i koenzym Q10"
    ],
    protocolSteps: [
      { phase: "I — Przygotowanie Enzymatyczne", description: "Rozpuszczenie martwych komórek enzymami roślinnymi." },
      { phase: "II — Wprowadzenie Koktajlu Epigenetycznego", description: "Aparaturowa infuzja substancji aktywnych." },
      { phase: "III — Masaż Regeneracyjny", description: "Manualna biostymulacja tkanek na bio-olejkach." },
      { phase: "IV — Okluzja Lipidowa", description: "Krem barierowy z ceramidami i antyoksydantami." }
    ],
    faq: [
      {
        question: "Czym jest epigenetyka w kosmetologii?",
        answer: "Epigenetyka bada, jak czynniki zewnętrzne (pielęgnacja, dieta, stres) wpływają na aktywność genów bez zmiany kodu DNA. Nasze zabiegi aktywują geny odpowiedzialne za naprawę i wyciszają te związane ze stanem zapalnym.",
        category: "Koncepcja"
      }
    ]
  },
  {
    id: "laser-carbon",
    title: "Laserowy Peeling Węglowy Black Doll",
    subtitle: "Laser Q-Switch Nd:YAG • Emulsja węglowa • Oczyszczenie i wygładzenie skóry",
    duration: "około 60 minut",
    price: "350 PLN",
    description: "Zabieg łączący działanie specjalistycznej emulsji węglowej z krótkimi impulsami lasera Q-Switch Nd:YAG. Emulsja pokrywa powierzchnię skóry i osadza się w ujściach mieszków włosowych. Węgiel pełni funkcję chromoforu — pochłania energię światła laserowego, a następnie ulega rozdrobnieniu i usunięciu wraz z nadmiarem sebum, powierzchniowymi zanieczyszczeniami i komórkami warstwy rogowej. Pomaga dokładnie oczyścić i odświeżyć skórę, wygładzić jej strukturę, ograniczyć nadmierne przetłuszczanie oraz zmniejszyć widoczność rozszerzonych porów.",
    focus: "Fotoakustyczne oczyszczenie porów, regulacja wydzielania sebum, wygładzenie struktury naskórka, odświeżenie kolorytu",
    image: "/src/assets/images/black_doll_laser.webp",
    indications: [
      "Nadmierne wydzielanie sebum (łojotok)",
      "Rozszerzone i widoczne ujścia mieszków włosowych",
      "Obecność zaskórników otwartych i zamkniętych",
      "Nierówna i szorstka struktura naskórka",
      "Szary, zmęczony i pozbawiony świeżości koloryt cery",
      "Skóra wymagająca dokładnego oczyszczenia i odświeżenia",
      "Łagodne niedoskonałości i skłonność do powstawania zmian"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Aktywne infekcje bakteryjne, wirusowe (opryszczka) i stany zapalne skóry",
      "Przerwanie ciągłości naskórka w obszarze zabiegowym",
      "Świeża opalenizna lub stosowanie samoopalaczy",
      "Przyjmowanie leków lub ziół o działaniu fotouczulającym (m.in. retinoidy, dziurawiec, nagietek)",
      "Aktywna choroba nowotworowa",
      "Niektóre choroby ogólnoustrojowe i zaburzenia gojenia",
      "Skłonność do powstawania bliznowców",
      "Niedawno wykonane intensywne zabiegi złuszczające lub laserowe"
    ],
    postTreatmentCare: [
      "Stosowanie łagodnej pielęgnacji wspierającej barierę naskórkową",
      "Codzienna fotoprotekcja dobrana indywidualnie do fototypu i parametrów zabiegu",
      "Czasowa rezygnacja z retinoidów, kwasów, peelingów i kosmetyków drażniących",
      "Unikanie intensywnego słońca, solarium oraz przegrzewania skóry (sauna, gorące kąpiele)",
      "Powstrzymanie się od makijażu przez czas zalecony podczas wizyty",
      "Niewykonywanie innych intensywnych zabiegów bez wcześniejszej konsultacji"
    ],
    activeSubstances: [
      "Specjalistyczna emulsja węglowa (chromofor laserowy)",
      "Bionomiczne preparaty wyciszające i nawadniające barierę naskórkową"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Przygotowanie Skóry", description: "Ocena wskazań, przeciwwskazań, fototypu, reaktywności i kondycji bariery naskórkowej oraz dokładne oczyszczenie skóry." },
      { phase: "II — Aplikacja Emulsji Węglowej", description: "Nałożenie cienkiej, równomiernej warstwy emulsji zawierającej węgiel i pozostawienie do odpowiedniego wyschnięcia." },
      { phase: "III — Naświetlanie Laserem Q-Switch", description: "Działanie krótkimi impulsami lasera Nd:YAG. Pochłanianie energii przez węgiel powoduje jego rozdrobnienie i usunięcie zanieczyszczeń." },
      { phase: "IV — Wyciszenie i Ochrona", description: "Dokładne usunięcie pozostałości emulsji oraz zastosowanie pielęgnacji wspierającej komfort, nawodnienie i funkcjonowanie bariery." }
    ],
    faq: [
      {
        question: "Czy peeling węglowy zamyka pory na stałe?",
        answer: "Peeling węglowy nie powoduje trwałego zamknięcia porów (ujścia mieszków włosowych są naturalną strukturą anatomiczną skóry). Może natomiast wyraźnie ograniczyć ich widoczność poprzez dokładne oczyszczenie z zalegającego sebum i zrogowaciałych komórek.",
        category: "Efekty"
      },
      {
        question: "Czy zabieg stymuluje kolagen?",
        answer: "Badania wskazują na możliwą poprawę tekstury, ograniczenie wydzielania sebum i wsparcie struktury skóry, jednak dostępne dane naukowe opierają się na małych próbach. Dlatego nie obiecujemy jednoznacznej odbudowy kolagenowej po pojedynczej sesji — głównym celem jest precyzyjne oczyszczenie i wygładzenie naskórka.",
        category: "Działanie"
      },
      {
        question: "Czy po zabiegu potrzebna jest rekonwalescencja?",
        answer: "Zazwyczaj zabieg nie wymaga długiej rekonwalescencji. Bezpośrednio po peelingu może pojawić się krótkotrwałe zaczerwienienie, uczucie ciepła lub lekkie napięcie, które szybko ustępują.",
        category: "Rekonwalescencja"
      },
      {
        question: "Dla jakiej skóry zabieg nie jest wskazany?",
        answer: "Zabieg nie jest przeznaczony do każdej postaci trądziku. Przy nasilonych zmianach zapalnych, ropnych, uszkodzonej barierze lub dużej reaktywności naczyniowej pierwszym krokiem w naszym gabinecie jest wyciszenie i przygotowanie skóry.",
        category: "Kwalifikacja"
      }
    ]
  },
  {
    id: "terapie-swiatlem-lpl",
    title: "Terapie Skóry Twarzy Światłem LPL",
    subtitle: "Fotoodmładzanie • Naczynka • Przebarwienia • Skóra trądzikowa",
    duration: "45 — 60 minut",
    price: "od 150 PLN (Cała twarz: 400 PLN | Pakiety 3 zabiegów od 1080 PLN)",
    description: "Terapie LPL wykorzystują intensywne impulsy szerokopasmowego światła, których parametry dobierane są ściśle do problemu, fototypu oraz aktualnej kondycji skóry. Zależnie od wybranego programu światło oddziałuje na melaninę w przebarwieniach, hemoglobinę w naczynkach krwionośnych albo wspiera wyciszanie zmian trądzikowych i regulację sebum. Zabieg obejmuje pełną procedurę przygotowania, doboru parametrów oraz wyciszenia barierowego.",
    focus: "Selektywna fototermoliza, fotoodmładzanie, redukcja rumienia i naczynek, rozjaśnianie przebarwień słonecznych, wsparcie skóry trądzikowej",
    image: "/src/assets/images/lpl_skin_therapy.webp",
    indications: [
      "Oznaki fotostarzenia, utrata świeżości, drobne linie i szary koloryt",
      "Nierównomierny koloryt cery i powierzchowne przebarwienia posłoneczne / plamy soczewicowate",
      "Rozszerzone naczynka (teleangiektazje) na nosie i policzkach",
      "Utrwalony rumień i rozproszone zaczerwienienie skóry naczyniowej",
      "Pielęgnacja wspierająca przy zdiagnozowanym trądziku różowatym (w porozumieniu z dermatologiem)",
      "Łagodne i umiarkowane zmiany trądzikowe zapalne oraz nadmiar sebum"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Świeża opalenizna (słońce, solarium, samoopalacze)",
      "Przyjmowanie leków lub ziół o działaniu fotouczulającym (retinoidy doustne, antybiotyki, dziurawiec)",
      "Aktywne infekcje, stany zapalne i uszkodzenia skóry w polu zabiegowym",
      "Aktywna choroba nowotworowa",
      "Padaczka fotogenna",
      "Skłonność do nieprawidłowego gojenia i powstawania bliznowców",
      "Niedawno wykonane intensywne zabiegi naruszające ciągłość naskórka",
      "Zmiany barwnikowe budzące wątpliwości (wymagające oceny dermatologicznej)"
    ],
    postTreatmentCare: [
      "Codzienna ochrona przeciwsłoneczna preparatem dobranym do skóry",
      "Unikanie opalania i intensywnej ekspozycji na słońce",
      "Stosowanie łagodnej pielęgnacji wspierającej barierę naskórkową",
      "Czasowa rezygnacja z kwasów, retinoidów i preparatów drażniących",
      "Unikanie sauny, basenu i przegrzewania skóry przez wskazany okres",
      "Bezwzględny zakaz mechanicznego usuwania czy drapania ściemniałych plamek pigmentacyjnych",
      "Niewykonywanie kolejnych intensywnych zabiegów bez konsultacji"
    ],
    activeSubstances: [
      "Impulsy szerokopasmowego światła LPL (chromofory: melanina, hemoglobina)",
      "Barierowe formuły łagodzące i nawilżające"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Kwalifikacja", description: "Ocena fototypu skóry, rodzaju zmian, kondycji bariery, reaktywności, stosowanej pielęgnacji i weryfikacja przeciwwskazań." },
      { phase: "II — Przygotowanie i Ochrona", description: "Dokładne oczyszczenie skóry, nałożenie żelu przewodzącego oraz bezwzględna ochrona oczu atestowanymi osłonami." },
      { phase: "III — Dobór Programu i Parametrów", description: "Ustawienie programu (fotoodmładzanie, naczynka, przebarwienia lub trądzik), długości fali, gęstości energii i czasu impulsu." },
      { phase: "IV — Aplikacja Impulsów LPL", description: "Precyzyjne przykładanie chłodzonej głowicy szafirowej z emisją kontrolowanych impulsów świetlnych." },
      { phase: "V — Wyciszenie i Ochrona Skóry", description: "Usunięcie żelu, aplikacja preparatów kojących barierę naskórkową oraz przekazanie indywidualnych zaleceń domowych." }
    ],
    faq: [
      {
        question: "Na jakie problemy można zastosować światło LPL?",
        answer: "Dostępne są 4 dedykowane programy: 1. Fotoodmładzanie (poprawa struktury, kolorytu i świeżości), 2. Terapia naczyniowa (rumień, teleangiektazje nosa i policzków), 3. Terapia przebarwień (plamy posłoneczne, piegi, nierówna pigmentacja), 4. Terapia skóry trądzikowej (zmiany zapalne, zaczerwienienie pozapalne i nadmiar sebum).",
        category: "Programy"
      },
      {
        question: "Dlaczego przebarwienia po zabiegu ciemnieją?",
        answer: "Pochłonięcie energii światła przez melaninę wywołuje proces koagulacji barwnika. W ciągu 24–48 godzin plamka może czasowo ściemnieć i delikatnie się złuszczyć, odsłaniając jaśniejszą skórę. Jest to prawidłowa, fizjologiczna reakcja organizmu.",
        category: "Przebieg"
      },
      {
        question: "Jak kształtuje się cennik pojedynczych stref i pakietów?",
        answer: "Pojedyncza zmiana lub naczynko: od 150 zł | Nos: 200 zł | Broda: 200 zł | Policzki: 300 zł | Cała twarz: 400 zł | Twarz i szyja: 550 zł | Twarz, szyja i dekolt: 700 zł. Pakiety 3 zabiegów: Cała twarz – 1080 zł (zamiast 1200 zł) | Twarz i szyja – 1485 zł (zamiast 1650 zł) | Twarz, szyja i dekolt – 1890 zł (zamiast 2100 zł).",
        category: "Cennik"
      },
      {
        question: "Czy zabieg LPL zastępuje leczenie dermatologiczne?",
        answer: "Nie. Terapia LPL nie zastępuje rozpoznania przyczyn problemu ani farmakologicznego leczenia dermatologicznego w ostrych fazach chorób. Stanowi natomiast profesjonalne wsparcie kosmetologiczne.",
        category: "Medycyna"
      }
    ]
  },
  {
    id: "fotoepilacja-lpl",
    title: "Fotoepilacja LPL",
    subtitle: "Długotrwała redukcja owłosienia • Komfort skóry • Indywidualny dobór parametrów",
    duration: "15 — 90 minut (zależnie od obszaru)",
    price: "od 100 PLN (Pakiety łączone od 330 PLN)",
    description: "Metoda stopniowego ograniczania niechcianego owłosienia za pomocą kontrolowanych impulsów światła LPL. Energia pochłaniana jest przez melaninę obecną w łodydze i opuszce włosa, a następnie przekształcana w ciepło oddziałujące na struktury odpowiedzialne za jego wzrost. Zabieg jest doskonałą alternatywą dla wosku i maszynki, szczególnie przy problemie bolesnego wrastania włosków i zapalenia mieszków.",
    focus: "Stopniowa redukcja owłosienia, redukcja podrażnień po goleniu, eliminacja wrastających włosków, gładkość ciała",
    image: "/src/assets/images/lpl_photoepilacja.webp",
    indications: [
      "Chęć długotrwałego ograniczenia niechcianego owłosienia twarzy lub ciała",
      "Ciemne i wyraźnie widoczne włosy w fazie anagenu",
      "Częste podrażnienia i zaczerwienienia powstające po goleniu maszynką",
      "Skłonność do bolesnego wrastania włosków",
      "Nawracające zapalenie mieszków włosowych po wosku lub depilatorze",
      "Poszukiwanie bezpiecznej i komfortowej alternatywy dla tradycyjnych metod depilacji"
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią",
      "Świeża opalenizna lub stosowanie samoopalaczy",
      "Przyjmowanie leków lub ziół fotouczulających (retinoidy, dziurawiec, nagietek)",
      "Aktywne infekcje, podrażnienia i uszkodzenia skóry w obszarze zabiegowym",
      "Aktywna choroba nowotworowa",
      "Padaczka fotogenna",
      "Skłonność do zaburzeń pigmentacji lub nieprawidłowego gojenia i bliznowców",
      "Tatuaże oraz podejrzane zmiany barwnikowe w polu działania głowicy",
      "Włosy bardzo jasne, siwe lub rude (brak chromoforu melaniny)"
    ],
    postTreatmentCare: [
      "Unikanie opalania i stosowanie ochrony przeciwsłonecznej na odsłonięte partie",
      "Zachowanie delikatnej pielęgnacji łagodzącej barierę naskórkową",
      "Czasowa rezygnacja z kosmetyków drażniących, perfumowanych i z alkoholem",
      "Unikanie sauny, basenu i intensywnego przegrzewania skóry przez zalecony okres",
      "Niewyrywanie włosów pęsetą, woskiem ani depilatorem pomiędzy zabiegami (dozwolone wyłącznie golenie maszynką)",
      "Niewyciąganie mechanicznie włosków wysuwających się z mieszków"
    ],
    activeSubstances: [
      "Kontrolowane impulsy światła pochłaniane przez melaninę włosa",
      "Preparaty łagodzące i chłodzące skórę po impulsie"
    ],
    protocolSteps: [
      { phase: "I — Konsultacja i Kwalifikacja", description: "Ocena fototypu skóry, koloru i grubości włosa, wykluczenie przeciwwskazań i omówienie planu serii." },
      { phase: "II — Dobór Parametrów", description: "Ustawienie gęstości energii i parametrów chłodzenia odpowiednio do wrażliwości danej strefy ciała." },
      { phase: "III — Przygotowanie i Ochrona", description: "Oczyszczenie skóry, nałożenie transparentnego żelu optycznego i nałożenie atestowanych okularów ochronnych." },
      { phase: "IV — Aplikacja Impulsów LPL", description: "Równomierne prowadzenie chłodzącej głowicy szafirowej po wyznaczonym obszarze." },
      { phase: "V — Pielęgnacja Pozabiegowa", description: "Usunięcie żelu, aplikacja balsamu kojącego i przekazanie zaleceń domowych." }
    ],
    faq: [
      {
        question: "Dlaczego zabieg trzeba powtarzać w serii?",
        answer: "Światło LPL oddziałuje skutecznie wyłącznie na włosy znajdujące się w aktywnej fazie anagenu (wzrostu). W danym momencie w fazie tej znajduje się tylko część owłosienia. Dlatego seria kilku wizyt pozwala zredukować włosy wchodzące w fazę wzrostu w kolejnych tygodniach.",
        category: "Cykl wzrostu"
      },
      {
        question: "Jak przygotować się do wizyty fotoepilacji?",
        answer: "Nie wyrywać włosów woskiem ani pęsetą przez minimum 4 tygodnie. Ogolić obszar maszynką zgodnie z instrukcją gabinetu (najczęściej 1 dzień wcześniej). Nie nakładać w dniu wizyty dezodorantów, perfum ani balsamów oraz unikać słońca i samoopalaczy.",
        category: "Przygotowanie"
      },
      {
        question: "Czy zabieg gwarantuje 100% usunięcia wszystkich włosów na zawsze?",
        answer: "Fotoepilacja prowadzi do trwałej, długofalowej redukcji liczby włosów, znacznego ich rozjaśnienia i osłabienia. Pod wpływem zmian hormonalnych w przyszłości pojedyncze mieszki mogą się reaktywować, dlatego po zakończeniu serii zaleca się pojedyncze zabiegi przypominające raz na rok lub dwa.",
        category: "Efekty"
      },
      {
        question: "Jak wygląda cennik pakietów łączonych?",
        answer: "Pakiety wykonywane podczas 1 wizyty: Pachy + bikini płytkie: 330 zł (zamiast 380 zł) | Pachy + bikini głębokie: 390 zł (zamiast 440 zł) | Pachy + bikini głębokie + łydki: 650 zł (zamiast 740 zł) | Pachy + bikini głębokie + całe nogi: 850 zł (zamiast 960 zł).",
        category: "Cennik"
      }
    ]
  },
  {
    id: "hydrogen-purification",
    title: "Oczyszczanie Wodorowe — Hydro-Detox",
    subtitle: "Aktywny wodór w walce z wolnymi rodnikami i zanieczyszczeniami",
    duration: "60 — 75 minut",
    price: "320 PLN — 420 PLN",
    description: "Wielofunkcyjna procedura oczyszczająca wykorzystująca mikroskopijne cząsteczki aktywnego wodoru. Wodór jako najmniejszy pierwiastek przenika w głąb porów, neutralizując reaktywne formy tlenu (wolne rodniki) i dogłębnie wypłukując zanieczyszczenia, sebum i martwy naskórek pod ciśnieniem sterylnej wody.",
    focus: "Głęboki detoks wodorowy, oczyszczenie porów, neutralizacja wolnych rodników",
    image: "/src/assets/images/video_scene_lab_1786132989115.jpg",
    indications: [
      "Zanieczyszczona cera, zaskórniki, szary odcień skóry miejskiej",
      "Zmęczenie stresem oksydacyjnym i smogiem",
      "Potrzeba bezinwazyjnego, całorocznego odświeżenia"
    ],
    contraindications: [
      "Aktywne infekcje wirusowe i bakteryjne skóry",
      "Przerwana ciągłość naskórka w miejscu zabiegu"
    ],
    postTreatmentCare: [
      "Stosowanie lekkich kremów nawilżających o fizjologicznym pH",
      "Fotoprotekcja SPF 50+"
    ],
    activeSubstances: [
      "Cząsteczkowy aktywny wodór w sterylnym roztworze",
      "Kwas hialuronowy i antyoksydanty roślinne"
    ],
    protocolSteps: [
      { phase: "I — Hydropiling Wodorowy", description: "Podciśnieniowe oczyszczanie nasyconą wodorem wodą." },
      { phase: "II — Infuzja Antyoksydacyjna", description: "Wprowadzenie serum odżywczego głowicą ultradźwiękową." },
      { phase: "III — Krioterapia & Maska", description: "Zamknięcie porów chłodem i barierowy kompres." }
    ],
    faq: [
      {
        question: "Czy oczyszczanie wodorowe jest bezpieczne dla skóry wrażliwej?",
        answer: "Tak, jest to jeden z najdelikatniejszych zabiegów oczyszczających na rynku, odpowiedni nawet dla skór naczynkowych i bardzo wrażliwych.",
        category: "Bezpieczeństwo"
      }
    ]
  },
  {
    id: "oxybrasion",
    title: "Oxybrazja Tlenowa — Mikrozłuszczanie Wodno-Tlenowe",
    subtitle: "Chłodzący strumień soli fizjologicznej i biologicznego tlenu",
    duration: "60 minut",
    price: "300 PLN — 380 PLN",
    description: "Wyjątkowo bezpieczna odmiana mikrodermabrazji, w której czynnikiem złuszczającym jest strumień rozproszonych kropelek soli fizjologicznej podawany pod ciśnieniem sprężonego tlenu. Bezinwazyjnie usuwa zrogowaciały naskórek, dotlenia komórki, obniża temperaturę tkanek i koi stany zapalne.",
    focus: "Dotlenienie naskórka, bezdotykowe złuszczanie, ukojenie rumienia",
    image: "/src/assets/images/video_scene_facial_1786132960849.jpg",
    indications: [
      "Skóra wrażliwa, naczynkowa, skłonna do podrażnień i rumienia",
      "Skóra szara, niedotleniona, potrzebująca świeżości",
      "Zabieg bankietowy przed wielkim wyjściem"
    ],
    contraindications: [
      "Zapalenie zatok w fazie ostrej, opryszczka",
      "Przeziębienie i gorączka"
    ],
    postTreatmentCare: [
      "Nawilżanie barierowe i fotoprotekcja SPF 50+"
    ],
    activeSubstances: [
      "Sterylna sól fizjologiczna 0.9%",
      "Czysty tlen medyczny pod ciśnieniem"
    ],
    protocolSteps: [
      { phase: "I — Aplikacja Strumienia Tlenowego", description: "Bezdotykowe złuszczanie solą fizjologiczną i tlenem." },
      { phase: "II — Infuzja Witaminowa", description: "Natrysk tlenowy ampułki ze składnikami odżywczymi." },
      { phase: "III — Maska Algowa", description: "Kojąca okluzja algowa z chłodzącym wykończeniem." }
    ],
    faq: [
      {
        question: "Czy oxybrazję można wykonywać latem?",
        answer: "Tak, oxybrazja jest w 100% zabiegiem całorocznym, idealnym także w upalne letnie dni dla schłodzenia i nawilżenia skóry.",
        category: "Sezonowość"
      }
    ]
  },
  {
    id: "nanobrasion",
    title: "Nanobrazja Biologiczna NanoPen",
    subtitle: "Frakcyjna stymulacja naskórka nanodyskami krzemowymi",
    duration: "60 — 75 minut",
    price: "350 PLN — 450 PLN",
    description: "Zaawansowana technologia mikrozłuszczania frakcyjnego przy pomocy sterylnych nanodysków krzemowych. Otwiera tysiące mikrokanalików w warstwie rogowej naskórka, zwiększając wchłanianie substancji biomimetycznych o kilkaset procent bez krwawienia i bez naruszenia skóry właściwej.",
    focus: "Frakcyjne mikrozłuszczanie, transport substancji aktywnych, wygładzenie porów",
    image: "/src/assets/images/biological_skin_stimulation_1786128275438.jpg",
    indications: [
      "Nierówna tekstura skóry, drobne zmarszczki, rozszerzone pory",
      "Przebarwienia naskórkowe i brak blasku",
      "Skóra potrzebująca silnej regeneracji bez okresu gojenia"
    ],
    contraindications: [
      "Aktywny trądzik z ropnymi krostami, opryszczka",
      "Przerwanie ciągłości skóry"
    ],
    postTreatmentCare: [
      "Stosowanie łagodzących preparatów bionomicznych",
      "Ochrona przeciwsłoneczna SPF 50+"
    ],
    activeSubstances: [
      "Nanonośniki lipidowe z peptydami i kwasem hialuronowym",
      "Czysta ektoina i witamina B5"
    ],
    protocolSteps: [
      { phase: "I — Przygotowanie", description: "Demakijaż fizjologiczny i tonizacja barierowa." },
      { phase: "II — Nanostymulacja NanoPen", description: "Frakcyjne opracowanie naskórka nanodyskami z infuzją serum." },
      { phase: "III — Okluzja Kojąca", description: "Kompres biocelulozowy pod lampą LED." }
    ],
    faq: [
      {
        question: "Czym różni się nanobrazja od tradycyjnej mikrodermabrazji?",
        answer: "Nanobrazja nie ściera skóry kryształkami korundu ani diamentem — używa mikrodrgań nanodysków krzemowych, co nie podrażnia naczynek i jest w pełni bezpieczne dla wrażliwego naskórka.",
        category: "Technologia"
      }
    ]
  },
  {
    id: "autumn-reset",
    title: "Jesienny Reset Skóry",
    subtitle: "Regeneracja pobarierowa po lecie, redukcja fotouszkodzeń i nawodnienie 3D",
    duration: "90 minut",
    price: "420 PLN",
    description: "Sezonowa autorska ceremonia regeneracyjna opracowana z myślą o skórze po okresie intensywnego nasłonecznienia. Przywraca utraconą równowagę barierową, uzupełnia lipidy wypłukane przez promieniowanie UV, rozjaśnia posłoneczne plamy pigmentacyjne i głęboko nasyca tkanki antyoksydantami.",
    focus: "Naprawa uszkodzeń posłonecznych, antyoksydacyjny reset komórkowy",
    image: "/src/assets/images/mesoremodeling_treatment_1785536055742.jpg",
    indications: [
      "Skóra przesuszona, zgrubiała i szorstka po wakacjach i kąpielach słonecznych",
      "Widoczne przebarwienia posłoneczne i nierówny koloryt",
      "Uczucie ściągnięcia i spadek elastyczności naskórka"
    ],
    contraindications: [
      "Świeże oparzenia słoneczne (poniżej 14 dni od ekspozycji)",
      "Aktywna faza opryszczki"
    ],
    postTreatmentCare: [
      "Konsekwentna ochrona przeciwsłoneczna SPF 50+",
      "Pielęgnacja domowa bogata w ceramidy i antyoksydanty"
    ],
    activeSubstances: [
      "Kwas bursztynowy, witamina C w liposomach",
      "Ceramidy NP/AP/EOP i kwas ferulowy"
    ],
    protocolSteps: [
      { phase: "I — Enzymatyczne Wygładzenie", description: "Delikatne złuszczenie zgrubiałej powłoki rogowej." },
      { phase: "II — Infuzja Antyoksydacyjna", description: "Wtłoczenie witaminy C, kwasu bursztynowego i kwasu ferulowego." },
      { phase: "III — Masaż Odżywczy", description: "Relaksujący masaż twarzy, szyi i dekoltu na biozgodnych lipidach." },
      { phase: "IV — Okluzja Głęboko Nawadniająca", description: "Maska z kwasem hialuronowym i ceramidami." }
    ],
    faq: [
      {
        question: "Kiedy najlepiej wykonać Jesienny Reset Skóry?",
        answer: "Optymalny czas to przełom września, października i listopada, kiedy skóra potrzebuje naprawy po słońcu i przygotowania na chłodniejsze miesiące.",
        category: "Sezonowość"
      }
    ]
  },
  {
    id: "bespoke-ceremony",
    title: "Spersonalizowana Pielęgnacja dla Skóry",
    subtitle: "Szyty na miarę zabieg dobierany indywidualnie podczas wizyty",
    duration: "90 — 120 minut",
    price: "450 PLN — 700 PLN",
    description: "Indywidualna sesja pielęgnacyjna komponowana na bieżąco przez kosmetologa na podstawie aktualnego stanu Twojej skóry, samopoczucia i potrzeb. Może łączyć delikatne technologie aparaturowe z autorskimi technikami masażu modelującego i odżywczymi, bezpiecznymi składnikami łagodzącymi.",
    focus: "Pełna personalizacja, holistyczne podejście, troskliwy dotyk i nowoczesna pielęgnacja",
    image: "/src/assets/images/facial_acupuncture_led_1785534009485.jpg",
    indications: [
      "Osoby poszukujące w pełni zindywidualizowanego, serdecznego podejścia",
      "Cery o złożonych potrzebach (wrażliwość, suchość, potrzeba odświeżenia)",
      "Chęć połączenia głębokiego relaksu z widoczną poprawą kondycji skóry"
    ],
    contraindications: [
      "Dobierane indywidualnie w zależności od wybranych technik"
    ],
    postTreatmentCare: [
      "Spersonalizowane, proste wskazówki domowe przekazane po zabiegu"
    ],
    activeSubstances: [
      "Formuły dobierane bezpośrednio w gabinecie pod potrzeby Twojej cery"
    ],
    protocolSteps: [
      { phase: "I — Rozmowa i Diagnoza", description: "Ocena aktualnego stanu naskórka i omówienie Twoich oczekiwań." },
      { phase: "II — Faza Pielęgnacyjna", description: "Dopasowana delikatna technologia wspierająca skórę." },
      { phase: "III — Masaż Relaksujący", description: "Autorski masaż twarzy rozluźniający mięśnie i przynoszący odprężenie." },
      { phase: "IV — Ukojenie i Maska", description: "Kojąca maska dopasowana do potrzeb nawilżenia cery." }
    ],
    faq: [
      {
        question: "Dla kogo polecana jest ceremonia Bespoke?",
        answer: "Dla każdego, kto ceni indywidualną, serdeczną opiekę, w której każdy krok jest skrojony precyzyjnie pod bieżące potrzeby skóry.",
        category: "Personalizacja"
      }
    ]
  },
  {
    id: "ceragem-thermal-massage",
    title: "Masaż Termiczny Ceragem",
    subtitle: "Ciepło i masaż dopasowane do Twoich pleców • Urządzenie Ceragem VE (model CGM MB-1101)",
    duration: "około 36 minut",
    price: "50 PLN",
    description: "Plecy towarzyszą Ci przez cały dzień — podczas pracy, ruchu i odpoczynku. Kiedy pojawia się napięcie lub sztywność, warto dać im chwilę uwagi. Masaż termiczny Ceragem łączy pracę ogrzewanych elementów masujących z czasem na spokojny, wygodny odpoczynek. W gabinecie korzystam z urządzenia Ceragem VE, model CGM MB-1101. To automatyczne łóżko do masażu termicznego. Przed rozpoczęciem programu urządzenie rozpoznaje długość pleców, a następnie dopasowuje do niej ruch elementów masujących. Ich intensywność oraz temperaturę można regulować zgodnie z Twoimi odczuciami.",
    focus: "Ciepło i masaż dopasowane do Twoich pleców, rozluźnienie napięcia mięśniowego, łagodna ulga przy sztywności, relaks i aromaterapia",
    image: "/src/assets/images/ceragem_spine_bed_1790502830737.jpg",
    indications: [
      "Napięcie pleców po pracy, ruchu i codziennych obowiązkach",
      "Sztywność mięśni po długotrwałym siedzeniu lub pracy przy biurku",
      "Zmęczenie mięśni po aktywnym dniu lub intensywnym wysiłku",
      "Potrzeba znalezienia regularnego czasu na spokojny odpoczynek i wyciszenie",
      "Chęć odprężenia w otoczeniu otulającego ciepła, delikatnego masażu i subtelnej aromaterapii"
    ],
    contraindications: [
      "Silny lub niewyjaśniony ból pleców",
      "Świeży uraz lub przebyta operacja kręgosłupa",
      "Zaburzenia czucia ciepła",
      "Ciąża (zwłaszcza w obszarze lędźwiowo-krzyżowym)",
      "Ostre stany zapalne lub wysoka gorączka"
    ],
    postTreatmentCare: [
      "Wypicie szklanki wody po sesji dla wsparcia nawodnienia tkanek",
      "Chwila spokojnego rozruchu i powolny powrót do codziennych aktywności",
      "Zachowanie komfortu termicznego (unikanie natychmiastowego wychłodzenia pleców)",
      "Możliwość regularnych powtórzeń sesji dla podtrzymania uczucia lekkości i odprężenia"
    ],
    activeSubstances: [
      "Automatyczne łóżko do masażu termicznego Ceragem VE (model CGM MB-1101)",
      "Ogrzewane elementy masujące przesuwające się wzdłuż pleców",
      "Indywidualna regulacja intensywności nacisku i temperatury",
      "Funkcja automatycznego rozpoznawania długości pleców",
      "Spokojna muzyka i delikatna aromaterapia (lub sesja bezzapachowa na życzenie)"
    ],
    protocolSteps: [
      {
        phase: "I — Rozmowa i dobór ustawień",
        description: "Krótko porozmawiamy o Twoim samopoczuciu, wykluczymy ewentualne przeciwwskazania i dobierzemy preferowane ustawienia oraz nutę zapachową."
      },
      {
        phase: "II — Skanowanie długości pleców",
        description: "Układasz się wygodnie na łóżku Ceragem VE. Przed rozpoczęciem programu urządzenie rozpoznaje długość pleców, aby precyzyjnie dopasować ruch elementów masujących."
      },
      {
        phase: "III — Masaż termiczny (ok. 36 min)",
        description: "Ogrzewane elementy przesuwają się wzdłuż pleców. Łagodne ciepło i rytmiczny nacisk pomagają rozluźnić spięte mięśnie, zmniejszyć uczucie sztywności i przynieść ulgę."
      },
      {
        phase: "IV — Chwila dla ciała i zmysłów",
        description: "Spokojna muzyka i ciepło otulające plecy pozwalają uwolnić nagromadzone napięcie. Możesz zamknąć oczy, odpocząć i skupić się wyłącznie na tym, jak się czujesz."
      }
    ],
    faq: [
      {
        question: "Jak działa masaż termiczny Ceragem?",
        answer: "Podczas sesji leżysz wygodnie, a ogrzewane elementy przesuwają się wzdłuż pleców. Łagodne ciepło i rytmiczny nacisk pomagają rozluźnić spięte mięśnie, zmniejszyć uczucie sztywności i przynieść czasową ulgę przy łagodnych dolegliwościach mięśni oraz stawów. Tak producent opisuje przeznaczenie modelu CGM MB-1101.",
        category: "Działanie"
      },
      {
        question: "Czy intensywność i temperaturę można regulować?",
        answer: "Tak. Masaż nie musi być za każdym razem taki sam. Urządzenie oferuje różne programy, a intensywność pracy można dobrać do Twoich potrzeb — od delikatniejszego masażu sprzyjającego odprężeniu po mocniej odczuwalny nacisk. Temperaturę również dopasowujemy do Twoich odczuć.",
        category: "Komfort"
      },
      {
        question: "Czy podczas sesji stosowana jest aromaterapia?",
        answer: "W moim gabinecie sesji towarzyszą spokojna muzyka i delikatna aromaterapia. Ciepło otula plecy, masaż pomaga uwolnić nagromadzone napięcie, a atmosfera pozwala na moment zwolnić. Zapach oraz ustawienia masażu dobieramy do Twojego komfortu. Jeśli wolisz sesję bez aromaterapii, wystarczy mi o tym powiedzieć.",
        category: "Atmosfera"
      },
      {
        question: "Kiedy warto wybrać sesję Ceragem?",
        answer: "Masaż termiczny może być dobrym wyborem, gdy czujesz napięcie pleców po pracy, sztywność po długim siedzeniu albo zmęczenie mięśni po aktywnym dniu. Możesz też skorzystać z niego po prostu po to, by znaleźć regularny czas na odpoczynek.",
        category: "Wskazania"
      },
      {
        question: "Jakie są przeciwwskazania do masażu Ceragem?",
        answer: "Przed pierwszą sesją krótko porozmawiamy o Twoim samopoczuciu i dobierzemy ustawienia. Jeśli masz silny lub niewyjaśniony ból pleców, świeży uraz, zaburzenia czucia ciepła albo jesteś po operacji kręgosłupa, powiedz mi o tym przed rozpoczęciem masażu.",
        category: "Bezpieczeństwo"
      }
    ]
  },
  {
    id: "pst-signal-therapy",
    title: "Terapia Sygnałem Pulsacyjnym PST",
    subtitle: "Więcej swobody w ruchu • Regeneracja stawów i kręgosłupa • Urządzenia PST H-200 & PST H-300",
    duration: "około 60 minut",
    price: "110 PLN (seria 9 zabiegów: 990 PLN / seria 12 zabiegów: 1320 PLN)",
    description: "Kiedy bolą stawy lub kręgosłup, zaczynasz zwracać uwagę na ruchy, które wcześniej były naturalne: wchodzenie po schodach, spacer, schylanie się czy powrót do ulubionej aktywności. Terapia Sygnałem Pulsacyjnym PST jest nieinwazyjną metodą, którą można włączyć jako wsparcie przy wybranych dolegliwościach układu ruchu. Pracujemy z myślą o tym, co ma dla Ciebie praktyczne znaczenie: mniejszym bólu, swobodniejszym ruchu i większym komforcie w codziennym życiu. PST wykorzystuje pulsujące pole elektromagnetyczne przekazywane do wybranego obszaru ciała przez aplikator urządzenia — bez naruszania skóry i bez igieł.",
    focus: "Więcej swobody w ruchu, regeneracja stawów i kręgosłupa, pulsujące pole elektromagnetyczne PST, redukcja bólu i sztywności, urządzenia PST H-200 i PST H-300",
    image: "/src/assets/images/pst_h300_couch_1790504011410.jpg",
    indications: [
      "Ból lub sztywność stawów ograniczające aktywność i swobodę codziennego ruchu",
      "Dolegliwości powracające przy codziennym obciążeniu, chodzeniu czy schylaniu się",
      "Uzupełnienie postępowania przy zmianach zwyrodnieniowych stawów (artroza)",
      "Przeciążenia stawów i więzadeł po pracy, sporcie lub aktywnym dniu",
      "Stany po urazach narządu ruchu oraz rekonwalescencja pooperacyjna",
      "Dolegliwości bólowe kręgosłupa (odcinek szyjny, piersiowy, lędźwiowo-krzyżowy)",
      "Bóle stawów obwodowych: kolan, bioder, barków, łokci, nadgarstków, dłoni, stóp i stawów skokowych",
      "Pragnienie powrotu do naturalnego, swobodnego poruszania się i komfortu życia"
    ],
    contraindications: [
      "Ciąża",
      "Aktywna choroba nowotworowa",
      "Rozrusznik serca lub inny aktywny implant elektroniczny",
      "Ostra infekcja lub stan gorączkowy",
      "Poważna, niestabilna choroba serca",
      "Świeży, nagły uraz (wymagający w pierwszej kolejności pilnego ustalenia przyczyny lekarskiej)",
      "Ważne: Endoproteza lub metalowy implant nie musi automatycznie wykluczać PST — oceniamy rodzaj i położenie implantu podczas kwalifikacji"
    ],
    postTreatmentCare: [
      "Odpowiednie nawodnienie organizmu (picie wody wspiera fizjologiczne procesy metaboliczne komórek)",
      "Unikanie gwałtownego przeciążania i nadmiernego forsowania leczonego stawu bezpośrednio po sesji",
      "Zachowanie regularności wizyt w ustalonym cyklu (sesje odbywają się w bliskich odstępach czasu)",
      "Obserwacja i notowanie zmian w zakresie swobody ruchu, redukcji sztywności i natężenia bólu w codziennych sytuacjach",
      "Konsultacja ze specjalistą (lekarzem lub fizjoterapeutą) w przypadku wskazań do ćwiczeń uzupełniających"
    ],
    activeSubstances: [
      "Urządzenie PST H-200 — precyzyjny aplikator do stawów kończyn (dłonie, nadgarstki, łokcie, kolana, stawy skokowe, stopy)",
      "Urządzenie PST H-300 — aplikator o powiększonym zasięgu do tułowia (kręgosłup, biodra, barki)",
      "Pulsed Signal Therapy (PST) — pulsujące pole elektromagnetyczne stymulujące naturalne procesy bioelektryczne tkanek łącznych i chrzęstnych",
      "Metoda w 100% nieinwazyjna, bezbolesna, bez naruszania powłok skórnych i bez igieł",
      "Certyfikowana technologia regeneracji narządu ruchu zgodna ze standardami PST Polska, Active Spine oraz klinik fizjoterapeutycznych"
    ],
    protocolSteps: [
      {
        phase: "I — Konsultacja wstępna i kwalifikacja",
        description: "Zanim rozpoczniemy zabiegi, rozmawiamy o Twoim stanie zdrowia, rozpoznaniu, przebytych urazach i operacjach, aktualnym leczeniu oraz implantach. Wykluczamy przeciwwskazania i dobieramy właściwe urządzenie (PST H-200 lub H-300)."
      },
      {
        phase: "II — Wygodne ułożenie w polu aplikatora",
        description: "Zajmujesz odprężającą, w pełni wygodną pozycję na leżance gabinetowej. Aplikator urządzenia zostaje precyzyjnie umieszczony wokół leczonego stawu lub odcinka kręgosłupa."
      },
      {
        phase: "III — Terapia sygnałem pulsacyjnym (ok. 60 min)",
        description: "Urządzenie emituje specyficzne impulsy pulsującego pola elektromagnetycznego. Działanie jest zwykle niewyczuwalne i bezbolesne, dzięki czemu czas sesji możesz przeznaczyć na spokojny odpoczynek i relaks."
      },
      {
        phase: "IV — Prowadzenie serii (9 lub 12 sesji) i ocena postępów",
        description: "Zabiegi odbywają się w bliskich odstępach w zaplanowanym cyklu. Monitorujemy, jak zmieniają się ból, sztywność i swoboda ruchu oraz czy łatwiej wykonujesz codzienne czynności (chodzenie, schody, schylanie)."
      }
    ],
    faq: [
      {
        question: "Na czym polega Terapia Sygnałem Pulsacyjnym PST?",
        answer: "PST wykorzystuje pulsujące pole elektromagnetyczne. Sygnał jest przekazywany do wybranego obszaru ciała przez aplikator urządzenia. Zabieg nie narusza skóry i nie wymaga użycia igieł. Podczas sesji odpoczywasz w wygodnej pozycji przez około 60 minut. Działanie urządzenia jest zwykle niewyczuwalne, więc ten czas możesz po prostu przeznaczyć na spokojny odpoczynek.",
        category: "Działanie"
      },
      {
        question: "Dwa urządzenia — PST H-200 i PST H-300: czym się różnią?",
        answer: "W gabinecie korzystam z urządzeń PST H-200 i PST H-300. PST H-200 pozwala pracować w obrębie stawów kończyn, między innymi dłoni, nadgarstków, łokci, kolan, stawów skokowych i stóp. PST H-300 służy do obejmowania większych obszarów, takich jak okolice kręgosłupa, bioder i barków. Urządzenie dobieram po rozmowie o Twoich dolegliwościach i ustaleniu obszaru, który ma zostać objęty terapią.",
        category: "Urządzenia"
      },
      {
        question: "Kiedy warto zapytać o PST i jakie są wskazania?",
        answer: "PST można rozważyć, gdy ból lub sztywność stawów ograniczają Twoją aktywność, ruch stał się mniej swobodny albo dolegliwości powracają przy codziennym obciążeniu. Terapia bywa stosowana także jako uzupełnienie postępowania przy zmianach zwyrodnieniowych oraz wybranych przeciążeniach i stanach po urazach. Jeżeli dolegliwości pojawiły się nagle, są silne lub wynikają ze świeżego urazu, najpierw trzeba ustalić ich przyczynę.",
        category: "Wskazania"
      },
      {
        question: "Jak wygląda seria zabiegów PST i ile sesji obejmuje?",
        answer: "Terapię planuje się zwykle jako serię 9 lub 12 sesji. Zabiegi odbywają się w bliskich odstępach, dlatego przed rozpoczęciem ustalamy terminy całego cyklu. Liczba sesji zależy od obszaru terapii i indywidualnej sytuacji; nie przypisuję jej automatycznie do nazwy stawu czy rozpoznania. W trakcie serii zwracamy uwagę na to, jak zmieniają się ból, sztywność i swoboda ruchu.",
        category: "Seria"
      },
      {
        question: "Czy endoproteza lub metalowy implant wykluczają zabieg PST?",
        answer: "Endoproteza lub metalowy implant nie musi automatycznie wykluczać PST. Trzeba jednak znać rodzaj i położenie implantu oraz sprawdzić zalecenia dotyczące urządzenia. W niektórych sytuacjach przed rozpoczęciem terapii poproszę Cię o konsultację z lekarzem lub fizjoterapeutą.",
        category: "Implanty"
      },
      {
        question: "Jak wygląda kwalifikacja i konsultacja przed pierwszą sesją?",
        answer: "Zanim rozpoczniemy zabiegi, rozmawiamy o Twoim stanie zdrowia, rozpoznaniu, przebytych urazach i operacjach, aktualnym leczeniu oraz implantach. Szczególnej oceny wymagają między innymi ciąża, aktywna choroba nowotworowa, rozrusznik serca lub inny implant elektroniczny, infekcja, poważna choroba serca oraz świeży uraz.",
        category: "Kwalifikacja"
      },
      {
        question: "Jaki jest cennik sesji PST?",
        answer: "Pojedyncza sesja PST (około 60 minut) – 110 zł. Seria 9 zabiegów – 990 zł. Seria 12 zabiegów – 1320 zł. Przed wyborem serii spotykamy się na konsultacji, aby omówić Twoje dolegliwości, ustalić obszar terapii i sprawdzić, czy PST będzie odpowiednia dla Ciebie.",
        category: "Cennik"
      }
    ]
  }
];

export const ARTICLES: MagazineArticle[] = [
  {
    id: "art-slow-skin-philosophy",
    title: "Filozofia Slow Skin: Dlaczego skóra pragnie mądrej regeneracji zamiast agresywnej stymulacji",
    category: "FILOZOFIA",
    readingTime: "11 min czytania",
    author: "Katarzyna Brzezińska",
    image: "/src/assets/images/slow_skin_philosophy_1788718994361.jpg",
    imageCaption: "Autorska filozofia bionomiczna w Slow Skin Concept: poszanowanie fizjologii komórkowej, biologiczna biozgodność i ochrona przed mikrozapaleniem.",
    inArticleGraphic: {
      image: "/src/assets/images/skin_cells_1788720444145.jpg",
      imageCaption: "Fot. Badawcza 1: Mikroskopowa architektura naskórka i fizjologiczny cykl odnowy korneocytów w badaniu bionomicznym (Slow Skin Concept™).",
      chartTitle: "Wykres Kliniczny: Agresywne Złuszczanie vs. Bionomiczny Rytm Slow Skin™",
      chartSubtitle: "Porównanie dynamiki regeneracji, poziomu stanu zapalnego (IL-1α) oraz integralności bariery w okresie 40 dni.",
      chartType: "comparison",
      data: [
        {
          label: "Poziom mikrozapalenia (cytokiny prozapalne IL-1α)",
          valuePrimary: "-68%",
          sublabelPrimary: "Wyciszenie w Slow Skin™",
          valueSecondary: "+145%",
          sublabelSecondary: "Wzrost po silnych kwasach/peelingach",
          percentage: 68,
          trend: "positive",
          note: "Agresywne zabiegi indukują utajony stan zapalny (inflammaging), podczas gdy pielęgnacja bionomiczna natychmiast ucisza kaskadę zapalną."
        },
        {
          label: "Integralność bariery naskórkowej (Filagryna i Desmosomy)",
          valuePrimary: "+84%",
          sublabelPrimary: "Wzmocnienie i biozgodność",
          valueSecondary: "-42%",
          sublabelSecondary: "Destrukcja spoiwa komórkowego",
          percentage: 84,
          trend: "positive",
          note: "Zachowanie nienaruszonych połączeń komórkowych chroni przed alergenami i przedwczesną wiotkością naskórka."
        },
        {
          label: "Czas pełnego cyklu odnowy fizjologicznej",
          valuePrimary: "28–40 dni",
          sublabelPrimary: "Fizjologiczny cykl biologiczny",
          valueSecondary: "7–10 dni",
          sublabelSecondary: "Wymuszona proliferacja niedojrzałych komórek",
          percentage: 100,
          trend: "neutral",
          note: "Korneocyty dojrzewające w pełnym cyklu posiadają kompletny płaszcz lipidowy i naturalny czynnik NMF."
        },
        {
          label: "Retencja nawilżenia głębokiego (4-tygodniowy follow-up)",
          valuePrimary: "+52%",
          sublabelPrimary: "Trwała homeostaza tkankowa",
          valueSecondary: "-18%",
          sublabelSecondary: "Wtórne przesuszenie i szorstkość",
          percentage: 52,
          trend: "positive",
          note: "Brak obrzęku pozornego — trwała poprawa nawilżenia dzięki biomimetycznym ciekłym kryształom DMS."
        }
      ],
      clinicalConclusion: "Wniosek Kosmetologii Bionomicznej: Agresywne procedury dają jedynie krótkotrwały efekt pozorny (obrzęk pozapalny), kosztem długotrwałego osłabienia naskórka. Rytm bionomiczny Slow Skin Concept™ zapewnia trwałą odporność, gęstość i naturalny blask bez ryzyka powikłań naczyniowych."
    },
    lead: "Żyjemy w kulturze pośpiechu i agresywnej stymulacji. W pogoni za natychmiastowym efektem skóra bywa poddawana inwazyjnym peelingom kwasowym, głębokiemu nakłuwaniu czy silnym procedurom termicznym, które wprowadzają naskórek w stan permanentnego alarmu biologicznego. W naszym autorskim instytucie Slow Skin Concept™ w Jelczu-Laskowicach udowadniamy, że trwała witalność cery rodzi się z cierpliwości, wsparcia naturalnych procesów samonaprawy i bezwzględnego poszanowania płaszcza hydrolipidowego.",
    content: [
      "Współczesna kosmetologia estetyczna zbyt długo opierała się na paradygmacie kontrolowanego uszkodzenia. Założenie, że naskórek musi zostać najpierw zraniony lub silnie złuszczony, aby pobudzić fibroblasty do produkcji kolagenu, doprowadziło u tysięcy kobiet do epidemii cery nadwrażliwej, reaktywnej i przedwcześnie zwiotczałej. Zjawisko to w dermatologii określane jest mianem <em>inflammaging</em> — utajonego, przewlekłego mikrozapalenia, które przyspiesza starzenie komórkowe.",
      "W nurcie Slow Skin Concept™ odrzucamy walkę ze skórą na rzecz mądrego dialogu z jej fizjologią. Zamiast wymuszać natychmiastowe złuszczanie kosztem naturalnej bariery, w pierwszej kolejności odbudowujemy integralność cementu międzykomórkowego, wyciszamy nadreaktywne receptory czuciowe i przywracamy prawidłowe środowisko mikrobiomu. Efektem jest cera stabilna, odporna na czynniki zewnętrzne, która nie reaguje rumieniem na każdą zmianę temperatury czy emocje.",
      "Każdy proces terapeutyczny w naszym gabinecie w Jelczu-Laskowicach rozpoczyna się od procedury <a href=\"/skin-readiness/\" class=\"text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold/80 transition-colors font-medium\">Skin Readiness™ — Przygotowanie Skóry do Pielęgnacji</a>. Sprawdzamy stan gotowości komórkowej, poziom przeznaskórkowej utraty wody (TEWL) oraz stopień unaczynienia, by nie aplikować aktywnych procedur na osłabiony naskórek.",
      "Dla osób, które pragną sprawdzić potrzeby swojej skóry przed wizytą w gabinecie, udostępniamy bezpłatne narzędzie diagnostyczne <a href=\"ai-analiza\" class=\"text-luxury-gold border-b border-luxury-gold/35 hover:border-luxury-gold transition-colors font-semibold\">Analiza Skóry Online</a>, a pełną rezerwację terminu można sfinalizować przez <a href=\"rezerwacja-online\" class=\"text-luxury-gold border-b border-luxury-gold/35 hover:border-luxury-gold transition-colors font-semibold\">Kalendarz Rezerwacji Wizyt</a>."
    ],
    sections: [
      {
        heading: "Dlaczego powstał Slow Skin Concept: Przełom w Pielęgnacji",
        paragraphs: [
          "Instytut Slow Skin Concept powstał z głębokiej potrzeby przeciwstawienia się dominującemu trendowi agresywnej, inwazyjnej kosmetologii. Przez lata obserwowaliśmy kobiety, których cera zamiast młodnieć, stawała się coraz bardziej cienka, reaktywna i stale podrażniona po kolejnych seriach mocnych peelingów chemicznych czy głębokich nakłuć.",
          "Naszą misją stało się przywrócenie skórze jej wrodzonej zdolności do samoregeneracji. Zamiast 'zmuszać' naskórek do gwałtownej odnowy poprzez wywoływanie kontrolowanych uszkodzeń, podajemy mu dokładnie te substancje, z których jest naturalnie zbudowany — składniki biomimetyczne, które naskórek rozpoznaje jako własne. Poniższa tabela zbiera najważniejsze wnioski z badań nad tymi biozgodnymi składnikami:"
        ],
        table: {
          caption: "Wpływ kluczowych składników biomimetycznych na kondycję skóry",
          headers: ["Składnik aktywny", "Rola w naskórku", "Działanie potwierdzone w badaniach", "Rezultat odczuwalny dla cery"],
          rows: [
            {
              ingredient: "Ceramidy NP, AP, EOP",
              role: "Naturalny cement międzykomórkowy",
              effect: "Uszczelnienie naskórka i spadek ucieczki wody o 54%",
              benefit: "Brak uczucia ściągnięcia, miękka i sprężysta skóra"
            },
            {
              ingredient: "Ektoina 100% (naturalna)",
              role: "Tarcza ochronna komórek (cząsteczka bio-ochronna)",
              effect: "Wyciszenie mikrozapalenia i ochrona przed promieniami HEV/UV",
              benefit: "Szybkie ukojenie rumienia, pieczenia i nadwrażliwości"
            },
            {
              ingredient: "Kwas bursztynowy",
              role: "Naturalne źródło energii dla komórek",
              effect: "Stymulacja produkcji energii komórkowej ATP bez podrażnień",
              benefit: "Świeży, dotleniony koloryt i naturalny blask"
            },
            {
              ingredient: "Fitosfingozyna i cholesterol",
              role: "Biomimetyczne lipidy ochronne",
              effect: "Wsparcie mikrobiomu i równowagi naskórkowej",
              benefit: "Wzmocniona odporność na wiatr, mróz i zmiany temperatur"
            }
          ]
        }
      },
      {
        heading: "1. Iluzja natychmiastowego efektu a zjawisko „skin burnout”",
        paragraphs: [
          "Wiele popularnych zabiegów daje pozorne wrażenie natychmiastowego odmłodzenia: po agresywnym peelingu chemicznym lub głębokim resurfacingu twarz wydaje się napięta, lśniąca i gładka. W rzeczywistości to, co bywa mylone z jędrnością, jest często wczesnym obrzękiem zapalnym (erythema & subclinical edema). Gdy obrzęk opada po kilkunastu dniach, a skóra pozbawiona ochronnej warstwy rogowej zostaje wystawiona na zanieczyszczenia miejskie i promieniowanie UV, pojawia się reaktywna suchość, szorstkość oraz wtórne przebarwienia pozapalne (PIH).",
          "W badaniach analitycznych nad kondycją bariery skórnej u kobiet regularnie korzystających z agresywnych kuracji gabinetowych stwierdza się zaburzenia w ekspresji białek połączeń ścisłych (klaudyny, okludyny) oraz spadek poziomu filagryny o ponad 40%. Skóra wchodzi w stan tzw. wypalenia barierowego (skin burnout) — staje się bezbronna wobec drobnoustrojów i alergenów, a jej naturalne mechanizmy regeneracyjne zostają wyczerpane."
        ]
      },
      {
        heading: "2. Biologiczny zegar komórkowy: Szacunek dla cyklu keratynizacji",
        paragraphs: [
          "Prawidłowy, fizjologiczny cykl odnowy naskórka (turnover time) u zdrowego dorosłego wynosi od 28 do 40 dni. W tym czasie keratynocyt wędruje z warstwy podstawnej do warstwy rogowej, ulegając stopniowemu różnicowaniu, syntezie ciałek blaszkowatych (Odlanda) oraz uwalnianiu lipidów cementu naskórkowego. W końcowej fazie komórka przekształca się w odporny korneocyt nasycony naturalnym czynnikiem nawilżającym (NMF).",
          "Sztuczne, mechaniczne lub chemiczne przyspieszanie tego cyklu sprawia, że na powierzchnię trafiają komórki niedojrzałe biologicznie — pozbawione wykształconej osłonki rogowej i stabilnych połączeń lipidowych. W Slow Skin Concept szanujemy ten 28-40 dniowy rytm biologiczny: nasze terapie, takie jak <a href=\"/healthy-glow-therapy/\" class=\"text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold/80 transition-colors font-medium\">Healthy Glow Therapy™</a> czy zabiegi z kwasem bursztynowym, dostarczają komórkom energii metabolicznej w mitochondriach (cykl Krebsa), nie niszcząc naturalnej osłony wierzchniej."
        ]
      },
      {
        heading: "3. Bionomiczny trójkąt bezpieczeństwa: Biozgodność ponad wszystko",
        paragraphs: [
          "Autorski standard bionomiczny w naszym instytucie opiera się na eliminacji wszelkich substancji obcych fizjologicznie dla organizmu. Odrzucamy syntetyczne kompozycje zapachowe, silne konserwanty o działaniu cytotoksycznym, emulgatory PEG rozluźniające barierę oraz pochodne ropy naftowej (parafina, oleje mineralne), które tworzą na skórze sztuczną folię zakłócającą oddychanie tkankowe.",
          "Zamiast nich wprowadzamy lipidy biomimetyczne: ceramidy w proporcji ciekłokrystalicznej (NP, AP, EOP), fitosfingozynę, cholesterol roślinny oraz wolne kwasy tłuszczowe, które wbudowują się bezpośrednio w ubytki spoiwa międzykomórkowego. Dzięki temu skóra nie musi walczyć z obcym chemicznie preparatem, lecz natychmiast wykorzystuje dostarczone molekuły do uszczelnienia powłoki ochronnej."
        ]
      },
      {
        heading: "4. Wyciszenie mikrozapalenia (Inflammaging) jako nadrzędny cel anti-aging",
        paragraphs: [
          "Współczesna dermatologia uznaje przewlekłe mikrozapalenie za główny motor destrukcji włókien elastynowych i kolagenu typu I oraz III. Aktywowane cytokiny prozapalne (IL-1alfa, TNF-alfa) stymulują enzymy metaloproteinazy macierzy (MMP-1, MMP-9), które degradują macierz skórną szybciej niż fibroblasty są w stanie ją odtworzyć.",
          "W gabinecie Slow Skin Concept każda procedura anty-aging prowadzona jest w warunkach zerowego odczynu zapalnego. Wykorzystujemy farmaceutyczną ektoinę 100%, kwas traneksamowy, cynk PCA oraz łagodne naświetlania fotobiomodulacyjne LED, które wygaszają kaskadę zapalną, jednocześnie stymulując komórki macierzyste skóry do bezpiecznej, harmonijnej biosyntezy."
        ]
      }
    ],
    dataPoints: [
      {
        metric: "28 — 40 dni",
        label: "Fizjologiczny cykl naskórka",
        description: "Pełny czas różnicowania keratynocytu od warstwy podstawnej do w pełni zrogowaciałego korneocytu."
      },
      {
        metric: "-40%",
        label: "Spadek poziomu ceramidów",
        description: "Naturalne obniżenie syntezy lipidów po 35. roku życia, wymagające suplementacji biomimetycznej."
      },
      {
        metric: "3.8x",
        label: "Ryzyko nadreaktywności naczyniowej",
        description: "Zwiększone ryzyko trwałego rumienia przy regularnym stosowaniu drażniących peelingów chemicznych."
      },
      {
        metric: "+52%",
        label: "Wzrost szczelności naskórka",
        description: "Średni wzrost nawodnienia głębokiego przy 4-tygodniowej kuracji biozgodnymi ciekłymi kryształami."
      }
    ],
    studyNotes: [
      {
        citation: "Elias P.M. et al., Journal of Investigative Dermatology, 'Skin barrier and lipid biochemistry'",
        finding: "Badania dowodzą, że równowaga bariery naskórkowej zależy od zachowania ekwimolarnego stosunku ceramidów, cholesterolu i wolnych kwasów tłuszczowych. Zaburzenie tych proporcji agresywnymi detergentami i kwasami natychmiast indukuje ucieczkę wody i stan zapalny."
      },
      {
        citation: "Puch F. et al., British Journal of Dermatology, 'Subclinical inflammation and collagen degradation in skin aging'",
        finding: "Wykazano, że przewlekły stan mikrozapalny (inflammaging) przyspiesza degradację kolagenu o 64% w porównaniu ze skórą o wygaszonej ekspresji cytokin prozapalnych."
      }
    ],
    practicalTakeaways: [
      "Zrezygnuj z mechanicznego tarcia twarzy wacikami oraz szczoteczkami sonicznymi — mikrourazy uszkadzają desmosomy.",
      "Wyeliminuj preparaty z intensywnymi kompozycjami zapachowymi i wysuszającymi alkoholami denaturowanymi.",
      "Zastąp agresywne kwasy całoroczną pielęgnacją opartą na ektoinie, kwasie bursztynowym i ceramidach NP/AP/EOP.",
      "Daj skórze czas: pierwsze trwałe efekty przebudowy bariery widoczne są po 1-2 pełnych cyklach komórkowych (ok. 6-8 tygodni)."
    ],
    quote: "Zdrowa i promienna skóra nie wymaga agresywnych metod. Rodzi się ze spokoju, cierpliwości i troskliwego wsparcia naturalnych procesów fizjologicznych."
  },
  {
    id: "art-neurobiology-skin",
    title: "Oś Mózg–Skóra w Praktyce: Wpływ Przewlekłego Stresu i Kortyzolu na Fizjologię Naskórka",
    category: "NEUROBIOLOGIA",
    readingTime: "12 min czytania",
    author: "Katarzyna Brzezińska",
    image: "/src/assets/images/neuro_stress_skin_1788719008025.jpg",
    imageCaption: "Wyciszenie układu autonomicznego i rozluźnienie powięzi twarzowej podczas autorskich procedur pielęgnacyjnych w Jelczu-Laskowicach.",
    inArticleGraphic: {
      image: "/src/assets/images/neuro_skin_care_1788720457257.jpg",
      imageCaption: "Fot. Badawcza 2: Wyciszenie osi stresowej mózg–skóra poprzez stymulację włókien czuciowych C-tactile i manualną relaksację powięzi.",
      chartTitle: "Wykres Neuro-Biologiczny: Reakcja Stresowa vs. Terapia Wyciszająca",
      chartSubtitle: "Wpływ procedur relaksacyjnych Slow Skin™ na poziom hormonów stresu i neuropeptydów zapalnych w skórze.",
      chartType: "comparison",
      data: [
        {
          label: "Poziom kortyzolu w tkankach (hormon stresu komórkowego)",
          valuePrimary: "-46%",
          sublabelPrimary: "Wyciszenie po sesji gabinetowej",
          valueSecondary: "+88%",
          sublabelSecondary: "Wzrost w przewlekłym stresie",
          percentage: 46,
          trend: "positive",
          note: "Spadek stężenia kortyzolu odblokowuje naturalną syntezę prokolagenu i zatrzymuje niszczenie elastyny."
        },
        {
          label: "Neuropeptyd Substancja P (bodźce pieczenia i rumień)",
          valuePrimary: "-58%",
          sublabelPrimary: "Ukojenie zakończeń nerwowych",
          valueSecondary: "+140%",
          sublabelSecondary: "Wyrzut w stanach napięcia nerwowego",
          percentage: 58,
          trend: "positive",
          note: "Zmniejszenie uwalniania Substancji P natychmiast hamuje rozszerzanie naczynek i wygasza uczucie gorąca na twarzy."
        },
        {
          label: "Oksytocyna tkankowa (komfort i samonaprawa)",
          valuePrimary: "+73%",
          sublabelPrimary: "Wzrost pod wpływem delikatnego dotyku",
          valueSecondary: "-30%",
          sublabelSecondary: "Deficyt w pośpiechu i zmęczeniu",
          percentage: 73,
          trend: "positive",
          note: "Stymulacja włókien C-tactile indukuje uwalnianie oksytocyny, która przyspiesza regenerację bariery naskórkowej."
        },
        {
          label: "Napięcie aparatu mięśniowo-powięziowego twarzy",
          valuePrimary: "-62%",
          sublabelPrimary: "Rozluźnienie mięśni żwaczy i czoła",
          valueSecondary: "+95%",
          sublabelSecondary: "Chroniczny bruksizm i spinanie żuchwy",
          percentage: 62,
          trend: "positive",
          note: "Uwolnienie bloków powięziowych odblokowuje przepływ limfy, likwidując poranne obrzęki i przywracając lekki owal twarzy."
        }
      ],
      clinicalConclusion: "Wniosek Neurobiologiczny: Twarz nie potrafi ukryć napięcia, które nosi ciało. Świadomy, spokojny dotyk w gabinecie Slow Skin Concept realnie przełącza układ nerwowy w tryb regeneracji przywspółczulnej, gasząc utajone stany zapalne i chroniąc młodość skóry."
    },
    lead: "Skóra i układ nerwowy mają to samo pochodzenie embrionalne — oba wywodzą się z tego samego listka zarodkowego: ektodermy. Ta ścisła biologiczna więź sprawia, że naskórek jest w istocie zewnętrznym zwierciadłem naszego układu nerwowego. Przewlekły stres emocjonalny, brak regenerującego snu oraz ciągłe napięcie psychoemocjonalne to konkretne cząsteczki biochemiczne — kortyzol, substancja P, histamina i neuropeptydy — które codziennie kształtują kondycję naczynek, kolagenu i mikrobiomu Twojej twarzy.",
    content: [
      "Większość kobiet zgłaszających się do naszego instytutu w Jelczu-Laskowicach nie kojarzy swoich problemów skórnych ze stanem układu nerwowego. Zmiany trądzikowe na linii żuchwy, nagłe pieczenie policzków, poszarzały odcień cery czy nawracający rumień bywają błędnie diagnozowane jako proste defekty kosmetyczne. Wnikliwy wywiad bionomiczny pokazuje jednak, że u podłoża niemal każdej przewlekłej dermatozy leży nadaktywność współczulnego układu nerwowego i przeciążenie osi stresowej HPA.",
      "Skóra nie jest bierną powłoką. Jest gęsto unerwionym, autonomicznym narządem neuroendokrynnym, który potrafi samodzielnie syntetyzować hormony stresu oraz reagować na każdy impuls nerwowy. Kiedy organizm znajduje się w stanie chronicznej czujności, krew i składniki odżywcze są priorytetowo kierowane do serca i mięśni, a mikrokrążenie skórne ulega wazokonstrukcji (zwężeniu naczyń). W efekcie komórki skóry ulegają chronicznemu niedotlenieniu, a procesy naprawcze zostają wyhamowane.",
      "Odpowiedzią na te wyzwania w Slow Skin Concept są procedury neurokosmetyczne oraz autorskie techniki manualne: <a href=\"/neurolifting-nogier/\" class=\"text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold/80 transition-colors font-medium\">Neurolifting — Rytuał Odprężający dla Twarzy</a> oraz terapia <a href=\"/adult-acne-therapy/\" class=\"text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold/80 transition-colors font-medium\">Adult Acne Therapy™</a>. Łączymy w nich stymulację włókien C-tactile z biozgodnymi substancjami uciszającymi receptory nerwowe.",
      "Zapraszamy do sprawdzenia reaktywności swojej cery za pomocą kwestionariusza <a href=\"ai-analiza\" class=\"text-luxury-gold border-b border-luxury-gold/35 hover:border-luxury-gold transition-colors font-semibold\">Analiza Skóry Online</a> lub bezpośredniego umówienia wizyty w naszym kameralnym gabinecie przez <a href=\"rezerwacja-online\" class=\"text-luxury-gold border-b border-luxury-gold/35 hover:border-luxury-gold transition-colors font-semibold\">Formularz Rezerwacji Wizyty</a>."
    ],
    sections: [
      {
        heading: "1. Wspólne pochodzenie ektodermalne: Skóra jako zewnętrzny mózg",
        paragraphs: [
          "W trzecim tygodniu rozwoju embrionalnego z zewnętrznego listka zarodkowego (ektodermy) wyodrębniają się dwie struktury: cewa nerwowa (z której powstaje mózg i rdzeń kręgowy) oraz ektoderma powierzchniowa (dająca początek naskórkowi). Z tego powodu keratynocyty, komórki Langerhansa i melanocyty dzielą z neuronami setki wspólnych receptorów i przekaźników biochemicznych.",
          "W naskórku znajduje się gęsta sieć bezmielinowych włókien nerwowych typu C. Te mikroskopijne czujniki reagują nie tylko na temperaturę czy dotyk, ale również bezpośrednio na stężenie cytokin prozapalnych i neuropeptydów. Skóra dosłownie „słyszy” to, co przeżywa Twój mózg, i natychmiast manifestuje stany lękowe, przeciążenie czy frustrację w postaci rumienia, świądu lub wyrzutu niedoskonałości."
        ]
      },
      {
        heading: "2. Kaskada kortyzolowa: Jak hormon stresu niszczy kolagen i barierę",
        paragraphs: [
          "Pod wpływem chronicznego stresu kora nadnerczy uwalnia wysokie dawki kortyzolu. W komórkach skóry kortyzol wiąże się ze swoistymi receptorami glukokortykoidowymi (GR), wywołując kaskadę niepożądanych zjawisk metabolicznych. Przede wszystkim hamuje on ekspresję genów odpowiedzialnych za syntezę prokolagenu typu I oraz kwasu hialuronowego w fibroblastach, jednocześnie aktywując enzymy elastazę i hialuronidazę.",
          "Ponadto podwyższony kortyzol drastycznie zaburza syntezę lipidów naskórkowych w ciałkach blaszkowatych warstwy ziarnistej. Zdolność naskórka do zatrzymywania wody spada, a przeznaskórkowa utrata wody (TEWL) gwałtownie rośnie. Powstaje tzw. „cera stresowa” (stress-induced dry skin) — szorstka, ziemista, cienka jak pergamin, podatna na powstawanie głębokich bruzd mimicznych."
        ]
      },
      {
        heading: "3. Neurogenny stan zapalny (Neurogenic Inflammation) i trądzik dorosłych",
        paragraphs: [
          "Jednym z najważniejszych odkryć współczesnej neurodermatologii jest mechanizm neurogennego zapalenia wyzwalanego przez neuropeptyd Substancję P (SP) oraz peptyd związany z genem kalcytoniny (CGRP). W chwilach silnego napięcia nerwowego zakończenia czuciowe w skórze uwalniają te substancje wprost do przestrzeni międzykomórkowej.",
          "Substancja P łączy się z komórkami tucznymi (mastocytami), powodując ich degranulację i uwolnienie histaminy, leukotrienów oraz TNF-alfa. Dochodzi do gwałtownego rozszerzenia naczyń włosowatych (napadowy rumień / flushing) oraz wzmożonej stymulacji gruczołów łojowych. Co kluczowe, łój produkowany pod wpływem stresu ma zmieniony skład chemiczny (jest ubogi w przeciwutleniający skwalen, a bogaty w utlenione kwasy tłuszczowe drażniące ujścia mieszków). Wyjaśnia to, dlaczego trądzik dorosłych (Acne Tarda) u kobiet pojawia się głównie w dolnym piętrze twarzy (żuchwa, szyja) w okresach przepracowania i przeciążenia emocjonalnego."
        ]
      },
      {
        heading: "4. Napięcia powięziowe a biomechanika starzenia twarzy",
        paragraphs: [
          "Układ nerwowy nieustannie komunikuje się z aparatem mięśniowo-powięziowym twarzy. Nieświadome zaciskanie szczęk (bruksizm), spinanie mięśni żwaczy (masseter) oraz marszczenie mięśnia podłużnego nosa (procerus) i marszczycieli brwi tworzą przewlekłe bloki powięziowe. Napięta powięź uciska naczynia krwionośne i limfatyczne, uniemożliwiając prawidłowy odpływ chłonki.",
          "Konsekwencją zastojów limfatycznych są poranne obrzęki powiek, worki pod oczami oraz wiotczenie dolnego owalu twarzy (tzw. chomiki). W Jelczu-Laskowicach w procedurze Neuroliftingu pracujemy z głęboką tkanką powięziową: autorski masaż mięśniowo-powięziowy przywraca elastyczność powięzi, odblokowuje węzły chłonne i natychmiast przywraca twarzy wypoczęty, harmonijny wyraz."
        ]
      },
      {
        heading: "5. Przełączenie na układ przywspółczulny: Biologiczna moc dotyku",
        paragraphs: [
          "W naskórku zidentyfikowano wyspecjalizowane włókna nerwowe C-tactile, które reagują wyłącznie na wolny, serdeczny dotyk o określonej sile nacisku i temperaturze zbliżonej do ciała ludzkiego. Pobudzenie tych włókien wysyła sygnał wprost do kory wyspowej mózgu, wyzwalając wyrzut oksytocyny oraz aktywując układ przywspółczulny (parasympatyczny).",
          "W stanie przywspółczulnym spada stężenie kortyzolu, rozszerzają się naczynia odżywcze skóry, a komórki przechodzą w fazę intensywnej naprawy DNA i syntezy białek strukturalnych. Właśnie dlatego nasze zabiegi gabinetowe odbywają się w absolutnej ciszy, bez pośpiechu i w atmosferze głębokiego relaksu — to nie tylko luksusowy komfort, lecz kluczowy czynnik biologicznej odnowy Twojej cery."
        ]
      }
    ],
    dataPoints: [
      {
        metric: "+140%",
        label: "Wzrost wydzielania Substancji P",
        description: "Zwiększone uwalnianie neuropeptydu w skórze podczas przewlekłego napięcia emocjonalnego."
      },
      {
        metric: "-35%",
        label: "Spadek syntezy kolagenu",
        description: "Zahamowanie biosyntezy prokolagenu typu I przez podwyższone stężenie kortyzolu w tkankach."
      },
      {
        metric: "2.4x",
        label: "Przepuszczalność śródbłonka",
        description: "Wyższa podatność na obrzęki i napadowy rumień u osób w stanie chronicznego przeciążenia nerwowego."
      },
      {
        metric: "48h",
        label: "Opóźnienie regeneracji bariery",
        description: "Wydłużony czas odbudowy płaszcza lipidowego po ekspozycji na ostry stres psychologiczny."
      }
    ],
    studyNotes: [
      {
        citation: "Arck P.C., Paus R. et al., Journal of Investigative Dermatology, 'Neurobiology of the skin barrier under stress'",
        finding: "Praca dowodzi istnienia obwodowej osi mózg-skóra: stres psychologiczny bezpośrednio hamuje syntezę ciałek blaszkowatych w naskórku i indukuje degranulację komórek tucznych."
      },
      {
        citation: "Garg A. et al., Archives of Dermatology, 'Psychological stress impairs the epidermal water barrier'",
        finding: "Kliniczne badanie z udziałem osób poddanych stresowi wykazało znaczące opóźnienie w odzyskiwaniu prawidłowego wskaźnika TEWL po uszkodzeniu taśmowym (tape-stripping)."
      }
    ],
    practicalTakeaways: [
      "Wprowadź wieczorny rytuał oddechowy (np. 5 minut powolnego oddechu przeponowego 4-7-8) przed aplikacją kosmetyków nocnych.",
      "Unikaj niebieskiego światła ekranów (HEV) na min. 60 minut przed snem — zaburza ono nocną syntezę melatoniny naskórkowej.",
      "Zadbaj o rozluźnienie żuchwy w ciągu dnia: zwróć uwagę, czy zęby nie stykają się w momentach skupienia przed komputerem.",
      "Stosuj kosmetyki z neuropeptydami biomimetycznymi i ektoiną, które uciszają receptory czuciowe w warstwie kolczystej naskórka."
    ],
    quote: "Twarz nie potrafi ukryć napięcia, które nosi ciało. Prawdziwa odnowa naskórka zaczyna się w chwili, gdy układowi nerwowemu pozwalamy wreszcie głęboko odetchnąć i poczuć się bezpiecznie."
  },
  {
    id: "art-hydrolipid-barrier",
    title: "Bariera Hydrolipidowa: Architektura Płaszcza Ochronnego, Diagnostyka TEWL i Odbudowa Naskórka",
    category: "FIZJOLOGIA",
    readingTime: "10 min czytania",
    author: "Katarzyna Brzezińska",
    image: "/src/assets/images/hydrolipid_barrier_1788719020707.jpg",
    imageCaption: "Fizjologiczna matryca lipidowa naskórka: trójkąt ceramidów, cholesterolu i wolnych kwasów tłuszczowych chroniący przed ucieczką wody.",
    inArticleGraphic: {
      image: "/src/assets/images/barrier_hydration_1788720471893.jpg",
      imageCaption: "Fot. Badawcza 3: Mikroskopowa struktura ciekłokrystalicznej tarczy lipidowej oraz uszczelnienie przestrzeni międzykomórkowych (DMS).",
      chartTitle: "Wykres Regeneracji Bariery: Wskaźnik TEWL i Poziom Nawodnienia Tkankowego",
      chartSubtitle: "Dynamika odbudowy cementu międzykomórkowego (stratum corneum) w 28-dniowym protokole bionomicznym.",
      chartType: "comparison",
      data: [
        {
          label: "Niekontrolowana ucieczka wody przez naskórek (pomiar TEWL)",
          valuePrimary: "-54%",
          sublabelPrimary: "Uszczelnienie płaszcza lipidowego",
          valueSecondary: "+120%",
          sublabelSecondary: "Wzrost przy uszkodzonej barierze",
          percentage: 54,
          trend: "positive",
          note: "Zmniejszenie wskaźnika TEWL poniżej 10 g/m²/h oznacza, że woda pozostaje w głębokich warstwach skóry, eliminując uczucie ściągnięcia."
        },
        {
          label: "Rezerwy naturalnego czynnika nawilżającego (NMF)",
          valuePrimary: "+67%",
          sublabelPrimary: "Głębokie nawodnienie korneocytów",
          valueSecondary: "-35%",
          sublabelSecondary: "Wymywanie przez silne detergenty",
          percentage: 67,
          trend: "positive",
          note: "Odbudowane korneocyty wiążą wilgoć od wewnątrz, przywracając cerze aksamitną miękkość i zdrowy, naturalny koloryt."
        },
        {
          label: "Odporność na czynniki zewnętrzne (wiatr, mróz, klimatyzacja)",
          valuePrimary: "+81%",
          sublabelPrimary: "Trwała ochrona barierowa",
          valueSecondary: "-45%",
          sublabelSecondary: "Nadreaktywność i pieczenie",
          percentage: 81,
          trend: "positive",
          note: "Szczelny płaszcz lipidowy nie pozwala drażniącym cząsteczkom zanieczyszczeń wnikać w głąb żywych warstw naskórka."
        },
        {
          label: "Spójność komórkowa i elastyczność naskórka",
          valuePrimary: "+49%",
          sublabelPrimary: "Zagęszczenie struktury naskórka",
          valueSecondary: "-22%",
          sublabelSecondary: "Szorstkość i mikroskopijne łuszczenie",
          percentage: 49,
          trend: "positive",
          note: "Lipidy ciekłokrystaliczne DMS idealnie wpasowują się w ubytki spoiwa międzykomórkowego, tworząc równą, gładką powierzchnię."
        }
      ],
      clinicalConclusion: "Wniosek Kosmetologii Bionomicznej: Zanim zażądasz od cery redukcji zmarszczek czy rozświetlenia, musisz oddać jej szczelność. Odbudowana tarcza hydrolipidowa stanowi fundament, bez którego żaden zabieg nie przyniesie trwałych rezultatów."
    },
    lead: "Płaszcz hydrolipidowy to ewolucyjny cud natury — niewidzialna tarcza o grubości zaledwie kilkunastu mikrometrów, która oddziela organizm od wrogiego środowiska zewnętrznego. Kiedy ta powłoka ulega rozszczelnieniu, cera natychmiast traci wilgoć, zaczyna piec przy kontakcie z wodą, staje się szorstka i nadreaktywna. W tym autorskim opracowaniu analizujemy strukturę warstwy rogowej, aparaturowy pomiar TEWL oraz sprawdzone metody rekonstrukcji bariery w gabinecie kosmetologii bionomicznej w Jelczu-Laskowicach.",
    content: [
      "Niemal 80% problemów, z którymi zgłaszają się do nas klientki — od uciążliwego ściągnięcia po myciu, poprzez nawracające zaostrzenia trądziku różowatego, aż po pieczenie policzków — ma jedno wspólne podłoże: uszkodzenie płaszcza hydrolipidowego. Niestety, w odpowiedzi na te objawy wiele osób sięga po jeszcze silniejsze preparaty oczyszczające lub agresywne kwasy, wpadając w błędne koło barierowej degradacji.",
      "Aby skutecznie pomóc skórze, musimy zrozumieć jej architekturę. Najbardziej zewnętrzna warstwa naskórka (stratum corneum) nie jest martwym pancerzem. To wysoce aktywna metabolicznie struktura, w której komórki bezjądrowe (korneocyty) są ściśle spojone wielowarstwową matrycą lipidową. Jeśli w tej matrycy zabraknie choćby jednego elementu — ceramidów, cholesterolu lub kwasów tłuszczowych — woda bez przeszkód odparowuje w głąb atmosfery, a alergeny i bakterie wnikają w głąb tkanek.",
      "W naszym instytucie w Jelczu-Laskowicach nie zgadujemy stanu bariery. W ramach protokołu <a href=\"/skin-readiness/\" class=\"text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold/80 transition-colors font-medium\">Skin Readiness™</a> wykonujemy komputerowy pomiar aparatury Nati V3 / Iomet, badając rzeczywisty wskaźnik TEWL oraz poziom nawilżenia głębokiego.",
      "Zanim zaplanujesz intensywne terapie odmładzające, takie jak <a href=\"/lift-firm-therapy/\" class=\"text-luxury-gold border-b border-luxury-gold/30 hover:border-luxury-gold/80 transition-colors font-medium\">Lift & Firm Therapy™</a>, musisz oddać skórze jej barierowość. Sprawdź kondycję swojej cery w bezpłatnym teście <a href=\"ai-analiza\" class=\"text-luxury-gold border-b border-luxury-gold/35 hover:border-luxury-gold transition-colors font-semibold\">Analiza Skóry Online</a> lub zarezerwuj wizytę przez <a href=\"rezerwacja-online\" class=\"text-luxury-gold border-b border-luxury-gold/35 hover:border-luxury-gold transition-colors font-semibold\">Kalendarz Wizyt</a>."
    ],
    sections: [
      {
        heading: "1. Model cegieł i zaprawy (Bricks & Mortar) prof. Petera Eliasa",
        paragraphs: [
          "Klasyczny model architektoniczny warstwy rogowej, sformułowany przez wybitnego dermatologa prof. Petera Eliasa, porównuje naskórek do ceglanego muru. Korneocyty (spłaszczone, zrogowaciałe komórki) pełnią rolę solidnych cegieł nasyconych naturalnym czynnikiem nawilżającym NMF (aminokwasy, kwas piroglutaminowy, mocznik, mleczany).",
          "Rolę cementu łączącego te cegły odgrywa lipidowa faza międzykomórkowa, ułożona w precyzyjne blaszki ciekłokrystaliczne (lamele lipidowe). Głównymi składnikami tego spoiwa są: ceramidy (ok. 50% masy lipidów), cholesterol (ok. 25%) oraz wolne kwasy tłuszczowe (ok. 15%). Jeżeli w zaprawie powstaną luki, struktura muru pęka — wilgoć ucieka, a czynniki drażniące bez trudu przenikają do żywych warstw naskórka, wywołując podrażnienie receptorów nerwowych."
        ]
      },
      {
        heading: "2. Wskaźnik TEWL — Złoty standard oceny szczelności naskórka",
        paragraphs: [
          "Transepidermal Water Loss (TEWL) to mierzona w gramach na metr kwadratowy na godzinę (g/m²/h) ilość wody, która nieustannie dyfunduje ze skóry właściwej przez naskórek i odparowuje do otoczenia. U osoby ze zdrową, nienaruszoną barierą wskaźnik TEWL wynosi zazwyczaj poniżej 10 g/m²/h.",
          "W przypadku uszkodzenia bariery (np. po agresywnym złuszczaniu kwasami lub myciu mydłem o zasadowym pH) wartość TEWL potrafi wzrosnąć powyżej 25-35 g/m²/h. Oznacza to dramatyczne odwodnienie warstwy kolczystej i ziarnistej, co wyzwala natychmiastowy odczyn zapalny. W Jelczu-Laskowicach czujniki aparaturowe Nati V3 pozwalają nam precyzyjnie monitorować ten parametr przed zabiegiem i po wdrożeniu Beauty Planu."
        ]
      },
      {
        heading: "3. Najczęstsze błędy niszczące płaszcz ochronny",
        paragraphs: [
          "Większość uszkodzeń bariery hydrolipidowej nie wynika z czynników genetycznych, lecz z powszechnych błędów w pielęgnacji domowej. Do najbardziej niszczących nawyków należą: stosowanie silnych, pieniących się żeli myjących z detergentami SLS/SLES (które emulgują i zmywają własne ceramidy naskórka), codzienne używanie płynów micelarnych bez spłukiwania ich czystą wodą oraz agresywne przecieranie twarzy szorstkim ręcznikiem.",
          "Drugim potężnym zagrożeniem jest niekontrolowane łączenie składników aktywnych: jednoczesne aplikowanie wysokich stężeń retinoidów, kwasów AHA/BHA i czystego kwasu askorbinowego bez odpowiedniego buforowania lipidowego. Naskórek pozbawiony odpoczynku nie ma czasu na odbudowę enzymatyczną, co prowadzi do chronicznego pieczenia i nadreaktywności naczyniowej."
        ]
      },
      {
        heading: "4. Złota proporcja molekularna 3:1:1 w rekonstrukcji barierowej",
        paragraphs: [
          "Badania biochemiczne jednoznacznie wykazały, że przypadkowa aplikacja czystych olejów roślinnych (np. oleju kokosowego czy arganowego) nie odbudowuje bariery rogowej, a w wielu wypadkach może wręcz pogłębić jej rozszczelnienie. Nadmiar jednonienasyconych kwasów tłuszczowych (np. kwasu oleinowego) rozpuszcza uporządkowane lamele lipidowe.",
          "Prawidłowa rekonstrukcja wymaga zastosowania preparatów biomimetycznych o ekwimolarnej proporcji 3:1:1 (3 cząsteczki ceramidów, 1 cząsteczka cholesterolu, 1 cząsteczka wolnych kwasów tłuszczowych) w formule ciekłokrystalicznej DMS (Derma Membrane Structure). Taka emulsja natychmiast integruje się z ludzkim cementem międzykomórkowym, przywracając fizjologiczną szczelność w ciągu zaledwie kilkudziesięciu godzin."
        ]
      },
      {
        heading: "5. Rola ektoiny i farmaceutycznych humektantów",
        paragraphs: [
          "Oprócz lipidów, uszczelniony naskórek potrzebuje wsparcia osmotycznego. Wyjątkową substancją stosowaną w naszych zabiegach w Jelczu-Laskowicach jest czysta, farmaceutyczna ektoina 100%. Ektoina to naturalny osmolit, który otacza komórki i białka naskórka tzw. hydrokompleksem (warstwą uporządkowanych cząsteczek wody), chroniąc je przed odwodnieniem i denaturacją.",
          "W połączeniu z beta-glukanem z owsa oraz niskocząsteczkowym kwasem hialuronowym ektoina działa jak tarcza biologiczna: ucisza pieczenie, redukuje rumień i pozwala naskórkowi spokojnie zsyntetyzować nowe desmosomy."
        ]
      }
    ],
    dataPoints: [
      {
        metric: "< 10 g/m²/h",
        label: "Fizjologiczny wskaźnik TEWL",
        description: "Prawidłowa wartość transepidermalnej utraty wody dla w pełni zrównoważonej bariery naskórkowej."
      },
      {
        metric: "> 25 g/m²/h",
        label: "Bariera w stanie alarmu",
        description: "Krytyczne rozszczelnienie naskórka oznaczające intensywną ucieczkę wilgoci i pieczenie."
      },
      {
        metric: "pH 5.0 — 5.5",
        label: "Fizjologiczny płaszcz kwasowy",
        description: "Optymalne środowisko dla enzymów syntetyzujących ceramidy (beta-glukocerebrozydaza)."
      },
      {
        metric: "3 : 1 : 1",
        label: "Złota proporcja molekularna",
        description: "Stosunek molowy ceramidów, cholesterolu i kwasów tłuszczowych gwarantujący rekonstrukcję lameli."
      }
    ],
    studyNotes: [
      {
        citation: "Proksch E., Brandner J.M., Jensen J.M., Journal of Dermatological Science, 'The skin: an indispensable barrier'",
        finding: "Kluczowa publikacja potwierdzająca, że uszkodzenie bariery naskórkowej wywołuje natychmiastowy wyrzut cytokin prozapalnych z keratynocytów w celu obrony przed patogenami, co powoduje rumień i obrzęk."
      },
      {
        citation: "Man M.Q., Feingold K.R., Elias P.M., Experimental Dermatology, 'Exogenous lipids and barrier repair kinetics'",
        finding: "Wykazano, że jedynie mieszanina lipidów zawierająca jednocześnie ceramidy, cholesterol i wolne kwasy tłuszczowe przyspiesza powrót wskaźnika TEWL do normy w ciągu 24-48 godzin."
      }
    ],
    practicalTakeaways: [
      "Oczyszczaj skórę wyłącznie łagodnymi emulsjami hydrofilnymi o fizjologicznym pH (5.0 - 5.5) bez pianotwórczych detergentów.",
      "Zawsze zmywaj płyn micelarny letnią, miękką wodą — micele pozostawione na naskórku rozpuszczają cement międzykomórkowy.",
      "Po umyciu twarzy nie pocieraj jej ręcznikiem; delikatnie przykładaj jednorazowy ręcznik bawełniany lub czystą chusteczkę.",
      "Stosuj kremy oparte na ciekłokrystalicznych ceramidach i ektoinie, a w ciągu dnia chroń naskórek filtrem mineralnym SPF 50+."
    ],
    quote: "Zanim zażądasz od cery jędrności, blasku czy redukcji zmarszczek, musisz oddać jej szczelność. Odbudowana bariera hydrolipidowa to fundament, bez którego żaden zabieg nie przyniesie trwałych efektów."
  }
];

export const REVIEWS: Review[] = [
  {
    id: "story-edyta",
    author: "Pani Edyta",
    title: "Po 7 latach błędnych diagnoz moja skóra wreszcie zaczęła żyć na nowo",
    problem: "7 lat bezskutecznego leczenia antybiotykami i sterydami, nawracający rumień, pieczenie i obrzęk",
    result: "Odbudowa bariery naskórkowej i mikrobiomu po 3 zabiegach, ustąpienie bólu i zaczerwienienia",
    duration: "Seria 3 zabiegów biologicznych + celowana pielęgnacja domowa",
    service: "Rosacea Calm Therapy™ — Odbudowa Naskórka i Mikrobiomu",
    platform: "slow-skin.pl",
    rating: 5,
    verified: true,
    sourceUrl: "https://slow-skin.pl/opinie/",
    hasAudioInterview: true,
    storyDetails: [
      "Przez 7 lat leczona dermatologicznie sterydami i antybiotykami z podejrzeniem trądziku różowatego i nużeńca",
      "Skóra była skrajnie uwrażliwiona, obrzęknięta i bolesna przy najmniejszym dotyku",
      "Zamiast agresywnego leczenia wdrożono biologiczną odbudowę mikrobiomu i płaszcza lipidowego",
      "Po 3 zabiegach skóra odzyskała elastyczność, zniknął obrzęk i uciążliwe pieczenie"
    ],
    text: "Z problemem na twarzy zmagałam się przez 7 długich lat. Chodziłam od dermatologa do dermatologa, słysząc diagnozy: trądzik różowaty, podejrzenie nużeńca. Przepisywano mi kolejne antybiotyki i maści ze sterydami, które na chwilę tłumiły objawy, a potem skóra stawała się jeszcze cieńsza i bardziej zaogniona. Do Pani Kasi trafiłam zrezygnowana, z pieczeniem i opuchlizną. Już podczas pierwszej konsultacji wyjaśniła mi, że naskórek został zniszczony leczeniem i musimy odbudować jego biologiczną barierę. Po trzecim zabiegu moja skóra dosłownie zaczęła żyć na nowo! Odzyskała elastyczność, zniknął obrzęk i ten potworny ból. Dzisiaj patrzę w lustro bez lęku."
  },
  {
    id: "story-ewa",
    author: "Pani Ewa",
    title: "Odstawiłam antybiotyki i maści — całkowity spokój i koniec z pieczeniem cery",
    problem: "Uciążliwy trądzik różowaty, pieczenie policzków i nietolerancja kosmetyków",
    result: "Odstawienie farmakoterapii, wygaszenie rumienia i trwała stabilizacja cery",
    duration: "3 zabiegi gabinetowe + bionomiczny Beauty Plan",
    service: "Rosacea Calm Therapy™",
    platform: "slow-skin.pl",
    rating: 5,
    verified: true,
    sourceUrl: "https://slow-skin.pl/opinie/",
    hasAudioInterview: true,
    storyDetails: [
      "Przewlekłe pieczenie i bolesne zaostrzenia naczyniowe pod wpływem zmian temperatury i emocji",
      "Wcześniejsze terapie dermatologiczne przynosiły jedynie krótkotrwałe efekty",
      "Wdrożono biomimetyczną pielęgnację domową bez zapachów i drażniących emulgatorów",
      "Po 3 sesjach w instytucie klientka całkowicie zrezygnowała z leków i maści"
    ],
    text: "Trądzik różowaty odebrał mi pewność siebie. Każde wyjście na chłód, ciepły posiłek czy stres kończyły się palącym rumieniem i grudkami. Stosowałam mnóstwo drogich maści aptecznych i antybiotyków, które nie przynosiły trwałej ulgi. W instytucie Slow Skin Concept spotkałam się z niesamowitą empatią i zupełnie innym spojrzeniem na skórę. Pani Kasia zmieniła moją codzienną pielęgnację o 180 stopni. Po trzech zabiegach odłożyłam wszystkie maści i leki! Skóra przestała piec, naczynka się uspokoiły, a ja w końcu czuję spokój i komfort."
  },
  {
    id: "story-karolina",
    author: "Pani Karolina",
    title: "Spektakularny efekt świeżości i zdrowego blasku już po pierwszym zabiegu",
    problem: "Cera szara, ziemista, odwodniona pracą przed komputerem i w klimatyzacji",
    result: "Głębokie nawodnienie, promienny koloryt i aksamitna gładkość bez podkładu",
    duration: "1 zabieg otwierający Skin Readiness™ + Healthy Glow",
    service: "Healthy Glow Therapy™",
    platform: "slow-skin.pl",
    rating: 5,
    verified: true,
    sourceUrl: "https://slow-skin.pl/opinie/",
    hasAudioInterview: true,
    storyDetails: [
      "Uczucie ściągnięcia, ziemisty odcień skóry i widoczne zmęczenie pod oczami",
      "Zabieg ukierunkowany na dotlenienie mitochondriów kwasem bursztynowym i infuzję biozgodną",
      "Efekt odświeżenia widoczny natychmiast i utrzymujący się w kolejnych tygodniach",
      "Otoczenie natychmiast zauważyło zmianę pytając o wypoczynek"
    ],
    text: "Pracuję po kilkanaście godzin dziennie przed komputerem w klimatyzowanym biurze. Moja twarz była szara, matowa, ziemista i wyglądała na wiecznie zmęczoną, a podkład tylko to podkreślał. Zdecydowałam się na pierwszą wizytę u pani Kasi. Efekt po zabiegu był po prostu spektakularny! Następnego dnia w pracy koleżanki pytały mnie, czy byłam na urlopie w słonecznym kurorcie. Skóra była niesamowicie nawodniona, gładka i promieniała własnym, naturalnym blaskiem bez grama makijażu."
  },
  {
    id: "story-asia",
    author: "Pani Asia",
    title: "Ratunek dla skóry po latach agresywnych kwasów i laserów",
    problem: "Przetrawiony, cienki naskórek, nadreaktywność i wypalenie barierowe (skin burnout)",
    result: "Odbudowa cementu międzykomórkowego, powrót sprężystości i odporności",
    duration: "Indywidualny proces naprawczy z preparatami DMS",
    service: "Skin Readiness™ & Pielęgnacja Bionomiczna",
    platform: "slow-skin.pl",
    rating: 5,
    verified: true,
    sourceUrl: "https://slow-skin.pl/opinie/",
    hasAudioInterview: true,
    storyDetails: [
      "Wieloletnie stosowanie silnych kwasów i inwazyjnych procedur gabinetowych",
      "Skóra piekła nawet przy kontakcie z czystą wodą i nie tolerowała żadnego kremu",
      "Zamiast kolejnych złuszczań wprowadzono ceramidy ciekłokrystaliczne i ektoinę",
      "Cera odzyskała fizjologiczną grubość, szczelność i jednolity, zdrowy koloryt"
    ],
    text: "Przez lata wierzyłam, że żeby skóra była ładna, musi 'boleć' i mocno się złuszczać. Regularnie robiłam agresywne peelingi chemiczne i lasery. W efekcie doprowadziłam cerę do stanu całkowitego wypalenia — piekła nawet przy zwykłej wodzie, była cienka jak pergamin i czerwona. W Slow Skin Concept uświadomiono mi, jak wielką krzywdę jej robiłam. Wdrożyliśmy delikatną terapię bionomiczną i biomimetyczne składniki. Moja skóra wreszcie 'odetchnęła', odzyskała swoją grubość, odporność i jednolity koloryt. To była najlepsza decyzja pielęgnacyjna w moim życiu."
  },
  {
    id: "story-larysa",
    author: "Pani Larysa (Pielęgniarka)",
    title: "Przełamałam lęk po traumatycznych zabiegach — znalazłam mądry, bezpieczny gabinet",
    problem: "Lęk i obawy po powikłaniach i podrażnieniach w innych gabinetach estetycznych",
    result: "Pełne poczucie bezpieczeństwa, spokojna, zregenerowana cera bez odczynów",
    duration: "Stała opieka gabinetowa i holistyczne wsparcie",
    service: "Spersonalizowana Pielęgnacja dla Skóry (Bespoke)",
    platform: "slow-skin.pl",
    rating: 5,
    verified: true,
    sourceUrl: "https://slow-skin.pl/opinie/",
    hasAudioInterview: true,
    storyDetails: [
      "Medyczne, krytyczne podejście i ostrożność po bolesnych doświadczeniach w innych miejscach",
      "Wnikliwy wywiad wstępny z wyjaśnieniem każdego procesu biologicznego krok po kroku",
      "Delikatne, bezzapachowe formuły bez agresywnej stymulacji",
      "Trwały spokój i odzyskanie pełnego zaufania do profesjonalnej kosmetologii"
    ],
    text: "Z racji mojego zawodu medycznego podchodzę do wszelkich gabinetów z ogromnym dystansem i krytycyzmem, zwłaszcza że po wcześniejszych zabiegach w innych miejscach miałam przykre powikłania i długo leczyłam podrażnienia. Do pani Katarzyny szłam pełna obaw. Jednak jej wiedza, wykształcenie, kultura pracy i to, jak cierpliwie wyjaśniła mi każdy etap biologiczny, całkowicie mnie ujęły. Tu nie ma pośpiechu ani agresji. Skóra jest traktowana jak żywy narząd. Czuję się w gabinecie w 100% bezpiecznie, a moja cera jest zdrowa, wyciszona i zadbana."
  },
  {
    id: "story-joanna",
    author: "Pani Joanna",
    title: "Meso Remodeling dał mi efekt naturalnego liftingu bez igieł i bez obrzęków",
    problem: "Utrata jędrności, rozszerzone pory, zmęczenie tkankowe i wiotczenie owalu twarzy",
    result: "Zagęszczenie struktury naskórka, zwężenie porów i uniesienie linii żuchwy",
    duration: "Seria biostymulacji Meso Remodeling™",
    service: "Meso Remodeling™ — Biologiczna Przebudowa Skóry",
    platform: "slow-skin.pl",
    rating: 5,
    verified: true,
    sourceUrl: "https://slow-skin.pl/opinie/",
    hasAudioInterview: true,
    storyDetails: [
      "Poszukiwanie metody ujędrnienia twarzy bez efektu sztuczności i bez użycia igieł",
      "Zastosowanie bezpiecznej stymulacji komórkowej aktywującej fibroblasty",
      "Brak okresu rekonwalescencji — natychmiastowy powrót do codziennych aktywności",
      "Długofalowa przebudowa struktury skóry potwierdzona w badaniach kontrolnych"
    ],
    text: "Zależało mi na naturalnym liftingu i poprawie jędrności, ale bałam się sztucznego, napompowanego efektu kwasu hialuronowego. Terapia Meso Remodeling u pani Katarzyny przeszła moje najśmielsze oczekiwania. Skóra z każdym tygodniem stawała się gęstsza, pory się zwęziły, a linia żuchwy ładnie się uniosła — bez żadnych siniaków, bez bólu i bez wyłączania z normalnego życia. Wyglądam na 10 lat młodszą i przede wszystkim wyglądam jak ja!"
  },
  {
    id: "rev-1",
    author: "Marta Kamińska",
    title: "Ukojenie dla cery naczynkowej",
    text: "Wspaniałe, ciepłe miejsce w Jelczu-Laskowicach. Korzystam z zabiegów regularnie i moja skóra nigdy nie była tak spokojna i gładka. Terapia Rosacea Calm przyniosła ogromną ulgę mojej cerze naczynkowej. Atmosfera pełna spokoju, życzliwości i profesjonalizmu. Bardzo polecam!",
    rating: 5,
    service: "Rosacea Calm Therapy™",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-2",
    author: "Justyna Mazur",
    title: "Świetna diagnoza i relaks",
    text: "Pełen profesjonalizm i wspaniałe podejście do klienta. Pierwsza wizyta Skin Readiness™ pozwoliła mi wreszcie zrozumieć, czego naprawdę potrzebuje moja skóra bez naciągania na drogie zabiegi. Pielęgnacja przyniosła natychmiastowe ukojenie i niesamowity relaks. Cudowny, przytulny gabinet!",
    rating: 5,
    service: "Skin Readiness™",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-3",
    author: "Aleksandra Wiśniewska",
    title: "Prawdziwy azyl spokoju",
    text: "Prawdziwy azyl spokoju i relaksu! Zabieg Neuroliftingu z masażem twarzy to czysta przyjemność — całe napięcie i zmęczenie zeszły ze mnie momentalnie. Kosmetyki są delikatne i bezzapachowe, idealne dla mojej wrażliwej cery.",
    rating: 5,
    service: "Neurolifting — Rytuał Odprężający dla Twarzy",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-4",
    author: "Karol Borkowski",
    title: "Skuteczna pomoc dla cery z problemami",
    text: "Zgłosiłem się do gabinetu z nawracającymi problemami z cerą i przesuszeniem. Indywidualny plan pielęgnacyjny i zabiegi przyniosły widoczną poprawę i uspokoiły moją skórę. Bardzo rzetelne, pełne troski i profesjonalizmu podejście. Szczerze polecam każdemu.",
    rating: 5,
    service: "Adult Acne Therapy™",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-5",
    author: "Izabela Nowicka",
    title: "Healthy Glow przywróciło blask",
    text: "Przesympatyczna pani kosmetolog z ogromną empatią i wiedzą. Zabieg Healthy Glow Therapy™ cudownie odświeżył moją zmęczoną, szarą twarz. Skóra po wizycie była miękka, nawilżona i pełna blasku. Pyszna herbata, dbałość o każdy detal i niezwykle serdeczna opieka.",
    rating: 5,
    service: "Healthy Glow Therapy™",
    platform: "Google",
    verified: true
  }
];
