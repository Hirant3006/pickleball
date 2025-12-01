# Changelog

All notable changes to the Pickle project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-01

### Added
- **Session Management**
  - Create sessions with unique shareable links
  - Join sessions via link with name entry
  - Real-time player list synchronization across devices

- **Expense Tracking**
  - Add multiple itemized expenses per session
  - Track amount, description, and who paid
  - Running expense total display

- **Debt Calculation**
  - Automatic equal-split calculation algorithm
  - Clear "who owes whom" display
  - Real-time updates as expenses are added
  - Accurate to 2 decimal places

- **Settlement Tracking**
  - Mark individual debts as paid
  - Visual indicators (strikethrough, checkmark, date)
  - Honor system settlement approach

- **Session Archiving**
  - Archive completed sessions (all debts paid)
  - Archive timestamp recording
  - Read-only mode for archived sessions

- **Archive History**
  - View all past sessions sorted by date
  - Browse session details (expenses, settlements, players)
  - Quick navigation from home page

- **UI/UX**
  - Swiss minimalist design system
  - Mobile-first responsive layout
  - High contrast black & white theme
  - System sans-serif fonts
  - Generous whitespace and readable typography

- **Technical Features**
  - Firebase Realtime Database integration
  - Multi-device real-time synchronization
  - Hash-based routing for easy deployment
  - TypeScript for type safety
  - Vite for fast development and optimized builds

### Technical Stack
- React 18.2.0
- TypeScript 5.3.0
- Vite 5.0.0
- Firebase 10.7.0
- Tailwind CSS 3.4.0
- React Router 6.20.0

### Documentation
- Comprehensive README with setup instructions
- Technical specification (`docs/tech-spec.md`)
- Epic breakdown (`docs/epics.md`)
- User stories (4 stories in `docs/sprint_artifacts/`)
- Workflow tracking (`docs/bmm-workflow-status.yaml`)

### Development
- BMad Method workflow scaffolding
- Agent-based development system
- Story-driven implementation
- Complete planning artifacts

---

## Future Enhancements (Not Yet Implemented)

### Planned Features
- Real payment integration (Venmo/PayPal APIs)
- User authentication and account management
- Session password protection
- Edit/delete expense capability
- Unequal split options (weighted distribution)
- Push notifications for unpaid debts
- Export session data (CSV, PDF)
- Session expiry and auto-archiving
- Analytics dashboard (spending trends, frequent players)
- Multi-currency support
- Receipt photo upload
- Recurring session templates

### Technical Improvements
- Comprehensive test suite (unit, integration, e2e)
- Firebase security rules (production-grade)
- Performance optimization (code splitting, lazy loading)
- PWA capabilities (offline support, app install)
- Internationalization (i18n)
- Dark mode support
- Accessibility audit (WCAG 2.1 AA compliance)

---

[1.0.0]: https://github.com/Hirant3006/pickleball/releases/tag/v1.0.0
