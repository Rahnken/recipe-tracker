# MealPlanner

A full-stack meal planning application built with the T3 Stack.

## Tech Stack

- Next.js (App Router)
- TypeScript
- tRPC
- Prisma (PostgreSQL)
- Clerk Authentication
- Tailwind CSS
- Shadcn/ui

## Feature Roadmap

### Phase 1: Core Meal Planning (MVP)

- [ ] User Authentication
  - [x] Sign up/Sign in with Clerk
  - [ ] User profile management
  - [ ] Basic user settings

- [ ] Meal Planning
  - [ ] Create meal plans (3-7 days)
  - [ ] Select meal types (Breakfast, Lunch, Dinner, Snack)
  - [ ] View meal plans in calendar format
  - [ ] Edit existing meal plans
  - [ ] Delete meal plans

- [ ] Recipe Management (Basic)
  - [ ] View list of available recipes
  - [ ] Basic recipe details (name, description, meal type)
  - [ ] Assign recipes to meal plan slots
  - [ ] Remove recipes from meal plan

### Phase 2: Recipe & Grocery Integration

- [ ] Enhanced Recipe Management
  - [ ] Create new recipes
  - [ ] Edit existing recipes
  - [ ] Delete recipes
  - [ ] Add preparation time
  - [ ] Add cooking time
  - [ ] Set serving sizes
  - [ ] Add recipe source/URL

- [ ] Ingredient Management
  - [ ] Create ingredient database
  - [ ] Categorize ingredients
  - [ ] Add ingredients to recipes
  - [ ] Specify quantities and units

- [ ] Grocery List Generation
  - [ ] Generate lists from meal plans
  - [ ] Adjust quantities based on servings
  - [ ] Organize by ingredient category
  - [ ] Export grocery lists
  - [ ] Mark items as purchased
  - [ ] Save commonly bought items

### Phase 3: Advanced Features

- [ ] Recipe Collections
  - [ ] Create recipe collections/categories
  - [ ] Tag recipes
  - [ ] Search and filter recipes
  - [ ] Recipe scaling

- [ ] Inventory Management
  - [ ] Track pantry inventory
  - [ ] Set low stock alerts
  - [ ] Update inventory from grocery lists
  - [ ] Suggest recipes based on inventory

- [ ] Meal Plan Templates
  - [ ] Save meal plans as templates
  - [ ] Create recurring meal plans
  - [ ] Copy previous meal plans

- [ ] User Experience Enhancements
  - [ ] Drag and drop meal planning
  - [ ] Recipe import from URLs
  - [ ] Mobile responsive design
  - [ ] Dark mode support

### Future Considerations

- Recipe sharing between users
- Nutritional information
- Dietary restrictions and allergen tracking
- Cost tracking and budgeting
- Meal prep instructions
- Integration with grocery delivery services
- Shopping list optimization
- Multi-user household support

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Bun (optional but recommended)

### Installation

1. Clone the repository
2. Install dependencies with `bun install`
3. Copy `.env.example` to `.env` and fill in required values
4. Run database migrations with `bunx prisma migrate dev`
5. Start the development server with `bun run dev`

### Environment Variables

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Contributing

This is a personal project but suggestions and feedback are welcome.

## License

[Your chosen license]
