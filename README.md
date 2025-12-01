# 🏓 Pickle - Pickleball Expense Split

A real-time expense tracking and splitting app for Pickleball groups. Built with React, Firebase, and Tailwind CSS.

## ✨ Features

- 🔗 **Shareable Sessions** - Create sessions with unique links, share with your group
- 👥 **Real-time Sync** - Multi-device synchronization via Firebase Realtime Database
- 💰 **Expense Tracking** - Log multiple itemized expenses (court, balls, water, etc.)
- 🧮 **Auto-calculation** - Automatic equal-split debt calculation
- ✅ **Settlement Tracking** - Mark debts as paid with visual indicators
- 📦 **Session Archive** - Archive completed sessions for historical reference
- 📱 **Mobile-first** - Swiss minimalist design, optimized for courtside use

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- Firebase account (free tier)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hirant3006/pickleball.git
   cd pickleball
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use existing
   - Enable **Realtime Database** (start in test mode for development)
   - Copy your Firebase config

4. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-app.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Creating a Session

1. Click **"New Session"** on the home page
2. Share the generated link with your group
3. Others join by opening the link and entering their name

### Adding Expenses

1. Once players have joined, use the **"Add Expense"** form
2. Enter description (e.g., "Court rental")
3. Enter amount (e.g., 40.00)
4. Select who paid from the dropdown
5. Click **"Add Expense"**

### Viewing Debts

- The **"Who Owes Whom"** section automatically calculates equal splits
- Shows clear statements like "Bob owes Alice $12.50"
- Updates in real-time across all devices

### Settling Up

1. Mark each debt as paid using the **"Mark as Paid"** button
2. Paid debts show strikethrough and checkmark
3. When all debts are paid, **"Archive Session"** button appears
4. Archive the session to clear the active view

### Viewing History

1. Click **"View Archives"** from the home page
2. Browse past sessions sorted by date
3. Click any session to view full details (read-only)

## 🏗️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS (Swiss minimalist design)
- **Database:** Firebase Realtime Database
- **Routing:** React Router (hash-based)
- **Deployment:** Vercel (recommended)

## 📁 Project Structure

```
pickle/
├── src/
│   ├── components/          # React components
│   │   ├── SessionCreate.tsx    # Home page with "New Session"
│   │   ├── SessionJoin.tsx      # Join session via link
│   │   ├── SessionView.tsx      # Active session view
│   │   ├── PlayerList.tsx       # Display players
│   │   ├── ExpenseForm.tsx      # Add expenses
│   │   ├── ExpenseList.tsx      # Display expenses
│   │   ├── DebtCalculator.tsx   # Show debts + settlement
│   │   └── SessionArchive.tsx   # View past sessions
│   ├── hooks/               # Custom React hooks
│   │   ├── useSession.ts        # Session data from Firebase
│   │   ├── useExpenses.ts       # Expenses data
│   │   ├── useDebts.ts          # Debt calculation
│   │   └── useSettlements.ts    # Settlement tracking
│   ├── lib/                 # Utilities and config
│   │   ├── firebase.ts          # Firebase initialization
│   │   ├── debtCalculator.ts    # Debt calculation algorithm
│   │   └── types.ts             # TypeScript types
│   ├── App.tsx              # Router configuration
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind imports
├── docs/                    # Project documentation
│   ├── tech-spec.md             # Technical specification
│   ├── epics.md                 # Epic breakdown
│   └── sprint_artifacts/        # User stories (4 stories)
├── public/                  # Static assets
├── index.html               # HTML shell
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind config (Swiss theme)
└── tsconfig.json            # TypeScript config
```

## 🧮 Debt Calculation Algorithm

The app uses a simple but effective algorithm to calculate who owes whom:

1. **Calculate total expenses:** Sum all expense amounts
2. **Calculate equal share:** `total ÷ number of players`
3. **Calculate net balance per player:** `amount paid - equal share`
   - Positive balance = owed money (creditor)
   - Negative balance = owes money (debtor)
4. **Match creditors with debtors:** Greedy pairing to minimize transactions
5. **Round to 2 decimals:** Prevent rounding errors

**Example:**
- Total: $58 (Court $40 + Balls $10 + Water $8)
- Players: 3 (Alice, Bob, Carol)
- Equal share: $19.33 each
- Alice paid $48 → owes $0, gets back $28.67
- Bob paid $10 → owes $9.33
- Carol paid $0 → owes $19.33

**Result:**
- Bob owes Alice $9.33
- Carol owes Alice $19.33

## 🎨 Design System

**Swiss Minimalist Aesthetic:**
- Clean, spacious layouts with generous whitespace
- High contrast black & white color scheme
- System sans-serif fonts (no web fonts)
- Large, readable typography (18px+ body text)
- Minimal borders and shadows
- Functional, grid-based layouts

## 🔒 Security Notes

**Current Implementation (MVP):**
- Firebase security rules set to **test mode** (open read/write)
- No user authentication
- Anyone with a session link can access and modify

**Production Recommendations:**
1. Implement Firebase security rules:
   ```json
   {
     "rules": {
       "sessions": {
         "$sessionId": {
           ".read": true,
           ".write": "data.child('archived').val() == false"
         }
       }
     }
   }
   ```
2. Add session password protection
3. Implement user authentication (Firebase Auth)
4. Add session expiry (auto-archive after X days)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Add environment variables** in Vercel dashboard:
   - Add all `VITE_FIREBASE_*` variables from `.env`

### Deploy to Firebase Hosting (Alternative)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize:**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 📊 Development Scripts

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Build for production (outputs to dist/)
npm run preview   # Preview production build locally
```

## 🤝 Contributing

This is a personal project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built using the **BMad Method** (rapid AI-assisted development workflow)
- Designed with **Swiss minimalism** principles
- Powered by **Firebase** for real-time synchronization
- UI framework: **Tailwind CSS**

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the [tech-spec](docs/tech-spec.md) for detailed implementation docs
- Review the [user stories](docs/sprint_artifacts/) for feature requirements

---

**Built with ❤️ for the Pickleball community**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
