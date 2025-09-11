# Agent Template: Skins Account Management Feature (Mobile-First)

## Context

You are helping implement a mobile-first skins account management UI for a golf club management
application. This feature allows members to view their skins game balance, winnings history,
transaction records, and payout preferences on mobile and desktop devices.

## Feature Overview

- **Purpose**: Member self-service for skins account information
- **Users**: Authenticated club members only
- **Tech Stack**: React 18+, TypeScript, TanStack Query, Bootstrap 5
- **API**: Django backend at http://localhost:8000/api/accounts/ (dev) / https://data.bhmc.org/api
  (prod)
- **Organization**: All code in `/src/skins/` with colocated tests

## Key Requirements

1. Mobile-first responsive design using Bootstrap 5
2. Display current skins balance prominently
3. Show seasonal winnings with filtering
4. Display transaction history
5. Allow payout preference updates
6. Maintain authentication security
7. Follow existing app patterns with touch-friendly interfaces

## Implementation Approach

- Use existing component patterns and styling
- Implement proper loading and error states
- Follow TanStack Query best practices
- Integrate with existing authentication system
- Ensure mobile responsiveness

## Files and Patterns

Refer to these patterns for the `/src/skins/` feature organization:

- **Components**: `/src/skins/components/` with `__tests__/` subfolders
- **Hooks**: `/src/skins/hooks/` for data fetching with colocated tests
- **Models**: `/src/skins/models/` for TypeScript interfaces
- **Screens**: `/src/skins/screens/` for page components
- **Services**: `/src/skins/services/` for API integration
- **Styling**: Bootstrap 5 utilities with mobile-first responsive design

## Development Guidelines

1. **Mobile-First**: Design for mobile screens first, enhance for desktop
2. **Testing**: Write tests colocated with code in `__tests__/` folders
3. **Error Handling**: Use existing error patterns with mobile-friendly UX
4. **Loading States**: Implement skeleton loaders optimized for touch interfaces
5. **Accessibility**: Follow WCAG guidelines with touch target sizes
6. **Performance**: Use React.memo and proper caching for mobile performance

## Common Tasks

### Creating a new component

1. Create TypeScript interface for props
2. Implement component with proper typing
3. Add loading and error states
4. Include responsive design
5. Write comprehensive tests
6. Document usage patterns

### Adding API integration

1. Define TypeScript models
2. Create API service functions
3. Implement TanStack Query hooks
4. Handle authentication headers
5. Add error handling
6. Test all scenarios

### Implementing forms

1. Use controlled components
2. Add form validation
3. Handle submission states
4. Provide user feedback
5. Implement accessibility
6. Test validation logic

## Troubleshooting

### Authentication Issues

- Check auth context integration
- Verify token handling
- Test unauthorized scenarios

### API Problems

- Validate request formats
- Check response handling
- Test error scenarios
- Verify CORS settings

### Styling Issues

- Use existing Bootstrap classes
- Follow responsive patterns
- Test mobile layouts
- Validate accessibility

### Performance Problems

- Check unnecessary re-renders
- Optimize API calls
- Implement proper caching
- Use code splitting

## Code Examples

### Basic Component Structure

```typescript
interface MyComponentProps {
  data: SomeType[];
  loading?: boolean;
  error?: string | null;
  onAction?: (id: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  data,
  loading = false,
  error = null,
  onAction
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!data.length) return <EmptyState />;

  return (
    <div className="my-component">
      {/* Component content */}
    </div>
  );
};
```

### TanStack Query Hook

```typescript
export const useSomeData = (id: string) => {
  return useQuery({
    queryKey: ["some-data", id],
    queryFn: () => apiService.getSomeData(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### API Service Function

```typescript
const apiService = {
  async getSomeData(id: string): Promise<SomeType> {
    const response = await fetch(`/api/some-endpoint/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  },
}
```

## Testing Patterns

### Component Testing

```typescript
describe('MyComponent', () => {
  it('renders loading state', () => {
    render(<MyComponent data={[]} loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<MyComponent data={[]} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders data correctly', () => {
    const data = [{ id: '1', name: 'Test' }];
    render(<MyComponent data={data} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
describe("useSomeData", () => {
  it("fetches data successfully", async () => {
    const { result } = renderHook(() => useSomeData("test-id"))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
  })
})
```

## Next Steps

When ready to implement:

1. Review the complete specification in `spec.md`
2. Check API contracts in `contracts/api.md`
3. Follow the quickstart guide for efficient development
4. Use this template for consistent patterns
5. Test thoroughly before deployment

## Resources

- **Specification**: `specs/001-add-a-feature/spec.md`
- **API Contracts**: `contracts/api.md`
- **Component Contracts**: `contracts/components.md`
- **Quickstart Guide**: `quickstart.md`
- **Existing Codebase**: Explore `src/` for patterns
