# 💸 Baaki — Smart Bill & Expense Splitter App

A Splitwise-inspired frontend application built with **React**, **TypeScript**, and **Vite**. Features dynamic bill splitting (equally, by portions/shares, percentage, or exact amounts), debt simplification, member management, and local storage persistence.

---

## 🌟 Key Features

1. **Home Page & Dashboard**:
   - Total spending summary across all projects.
   - Active spending projects grid with color gradients and member previews.
   - Quick launch action to create a new spend project.

2. **Create New Spends (Projects)**:
   - Customize spend title, category (Trip 🏖️, Home 🏠, Party 🎉, Couple ❤️, Other ✨), currency symbol, and theme gradient.
   - Add initial members directly during creation.

3. **Expenditure Management**:
   - Add expenditures to any specific spending project.
   - Record category, amount, payer, date, and notes.

4. **Advanced Flexible Bill Splitting**:
   - **Equally**: Split total evenly among selected members.
   - **Portions / Shares**: Assign unequal shares (e.g. 2 shares vs 1 share).
   - **Exact Amounts**: Input exact custom amounts for each person.
   - **Percentage (%)**: Allocate percentage distribution across members.
   - **Selective Participant Inclusion**: Include or exclude specific members from any expenditure.

5. **Smart Debt Simplification & Settle Up**:
   - Greedy debt minimization algorithm to collapse multi-party debts into minimal direct payments.
   - One-click "Settle Up" action with confetti celebrations.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
baaki/
├── src/
│   ├── components/
│   │   ├── AddExpenseModal.tsx    # Modal for adding expenditures & split logic
│   │   ├── CreateSpendModal.tsx  # Modal for creating new spend projects
│   │   └── ProjectDetailView.tsx # Detailed view for expenditures, balances & members
│   ├── types.ts                  # TypeScript data interfaces (SpendProject, Expense, SplitShare, etc.)
│   ├── utils.ts                  # State calculation helpers & debt simplification logic
│   ├── App.tsx                   # Main app & dashboard view
│   ├── index.css                 # Dark mode design system & glassmorphism styles
│   └── main.tsx                  # React entry point
├── index.html                    # Main HTML container & Web Fonts
├── package.json
└── vite.config.ts
```
