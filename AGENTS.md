# ExilonCMS - Agent Coding Guidelines

## Build, Lint, & Test Commands

### PHP/Laravel
```bash
# Run all tests
composer test
php artisan test

# Run single test file
php artisan test tests/Feature/UserTest.php
php artisan test tests/Unit/UserServiceTest.php

# Run specific test method
php artisan test --filter test_user_can_login

# Run tests with coverage
php artisan test --coverage

# Format code with Laravel Pint (auto-fix)
./vendor/bin/pint

# Check code style without auto-fix
./vendor/bin/pint --test

# Run migrations
php artisan migrate
php artisan migrate:fresh --seed
```

### TypeScript/React
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build
npm run build:all          # Build app + installer

# Type checking
npm run typecheck

# Linting (ESLint - currently disabled, see package.json)
npm run lint
```

## PHP Code Style Guidelines

### Imports & Namespaces
- Follow PSR-4 autoloading: `ExilonCMS\{Namespace}\{ClassName}`
- Use use statements for all classes (no fully qualified names)
- Order: external libraries → Laravel → ExilonCMS → current namespace
- Single namespace per file

### Formatting (Laravel Pint)
- PHP-CS-Fixer based formatting
- No trailing whitespace
- Space around operators: `$a + $b`, not `$a+$b`
- No space before colon in return types: `public function foo(): void`
- Array indentation: aligned with opening parenthesis
- 4 spaces for indentation (no tabs)

### Naming Conventions
- Classes: PascalCase (`UserController`, `ShopService`)
- Methods: camelCase (`getUser`, `createOrder`)
- Properties: camelCase for PHP code, snake_case for DB columns
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Variables: camelCase (`$userName`, `$orderId`)

### Type Safety
- Use type hints on all methods: `public function index(): Response`
- Use strict types when possible: `declare(strict_types=1);`
- Return type declarations required for all methods
- Nullability: `?string` for nullable, never for impossible returns

### PHPDoc
- Models: List all properties with `@property` and `@var` annotations
- Methods: Brief description for public API
- Parameters: `@param type $name description`
- Returns: `@return type description`

### Error Handling
- Never expose exceptions to users (use try-catch with logging)
- Use Laravel's `Log::error()` for critical failures
- Return appropriate HTTP status codes (400, 404, 500)
- Flash messages for user-facing errors
- Validation via FormRequest classes

### Models
- Use traits for shared behavior (`HasImage`, `Loggable`, `Searchable`)
- `$fillable` for mass-assignable fields
- `$casts` for type conversion (`datetime`, `boolean`, `array`)
- Relationships as methods: `public function posts() { return $this->hasMany(Post::class); }`
- Accessors with `get{Property}Attribute()`, mutators with `set{Property}Attribute()`

### Controllers
- Single responsibility: one resource per controller
- Inject dependencies via constructor
- Return Inertia responses: `Inertia::render('Page', $data)`
- Use Route model binding where possible
- Validate with FormRequest: `public function store(StoreUserRequest $request)`

## TypeScript/React Code Style Guidelines

### Imports
- External libraries first (`react`, `inertia`)
- Then @/ aliases: `@/components`, `@/types`
- Then relative imports: `./components`, `../hooks`
- Default exports for components: `export default function ComponentName()`
- Named exports for utilities: `export { functionOne, functionTwo }`

### Components
- PascalCase for component names: `UserList`, `ProductCard`
- Functional components with hooks (no class components)
- Props interface defined before component: `interface Props { ... }`
- Destructure props: `function UserList({ users }: Props) { }`
- Use forwardRef for DOM elements passed to children

### Type Safety (STRICT MODE)
- `strict: true` enabled in tsconfig.json
- All variables typed: `const [open, setOpen] = useState(false)`
- No `any` - use `unknown` or union types
- Interfaces for complex objects, types for unions
- Generic functions: `function identity<T>(arg: T): T`

### Naming Conventions
- Components: PascalCase (`UserProfile`, `DataTable`)
- Functions: camelCase (`handleClick`, `fetchData`)
- Hooks: camelCase starting with `use` (`useModal`, `useToast`)
- Constants: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- Interfaces: PascalCase (`UserData`, `ApiResponse`)
- Types: PascalCase, starting with T or descriptive (`ThemeColors`)

### State & Effects
- useState for local state, useRef for DOM refs, useMemo/useCallback for expensive ops
- Dependency arrays complete and specific
- Cleanup functions in useEffect return
- Avoid prop drilling - use Context for global state

### Forms
- Use react-hook-form with zod validation
- Use Inertia's router for form submissions
- Type errors: `FormErrors<UserFormData>`
- Preserve state on submission errors

### Styling
- Tailwind CSS for all styling
- shadcn/ui components via `@/components/ui/*`
- CSS-in-JS avoided (use classVariants for variants)
- Responsive design: mobile-first with breakpoints

## Testing Guidelines

### PHP Tests
- PHPUnit for all PHP tests
- Feature tests for HTTP endpoints (using `Illuminate\Foundation\Testing\RefreshDatabase`)
- Unit tests for services and business logic
- Arrange-Act-Assert pattern
- Descriptive test names: `test_user_can_create_post_with_valid_data`

### React/TypeScript Tests
- Not currently configured in CI
- Future: Jest + React Testing Library for component tests

## General Rules

1. **DRY**: Extract repeated logic into functions, services, or traits
2. **KISS**: Keep functions small and focused (single responsibility)
3. **SOLID principles**: Open for extension, closed for modification
4. **Internationalization**: Use `trans()` for all user-facing text
5. **Security**: Never commit secrets, validate all inputs, escape output
6. **Performance**: Use eager loading (`with()`), caching, and pagination
7. **Git**: Commit frequently, write clear messages, keep PRs focused
