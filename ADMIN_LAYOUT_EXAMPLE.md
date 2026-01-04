# AdminLayout Components - Usage Guide

## Structure

```tsx
import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutTitle,
  AdminLayoutActions,
  AdminLayoutContent,
  AdminLayoutFooter
} from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Page() {
  return (
    <AuthenticatedLayout>
      <Head title="Page Title" />

      <AdminLayout>
        {/* Header: Title + Actions */}
        <AdminLayoutHeader>
          <AdminLayoutTitle
            title="Page Title"
            description="Optional description of the page"
          />
          <AdminLayoutActions>
            <Button variant="outline">Secondary Action</Button>
            <Button>Primary Action</Button>
          </AdminLayoutActions>
        </AdminLayoutHeader>

        {/* Main Content */}
        <AdminLayoutContent>
          <div className="border border-border rounded-lg p-6 bg-card">
            {/* Your page content here */}
          </div>
        </AdminLayoutContent>

        {/* Optional Footer */}
        <AdminLayoutFooter>
          <p className="text-sm text-muted-foreground">Footer info</p>
          <Button>Save</Button>
        </AdminLayoutFooter>
      </AdminLayout>
    </AuthenticatedLayout>
  );
}
```

## Components

### `AdminLayout`
Main container for the entire admin page layout.

### `AdminLayoutHeader`
Container that holds the title and actions in a flex row with space-between.

### `AdminLayoutTitle`
- **Props**: `title`, `description` (optional)
- Displays the page title and optional description

### `AdminLayoutActions`
- Container for action buttons (Create, Export, etc.)
- Automatically spaced with gap-3

### `AdminLayoutContent`
- Main content area
- Use this to wrap your tables, forms, etc.

### `AdminLayoutFooter`
- Optional footer with border-top
- Good for Save buttons, pagination info, etc.

## Example: List Page

```tsx
<AdminLayout>
  <AdminLayoutHeader>
    <AdminLayoutTitle
      title="Users"
      description="Manage all users of your site"
    />
    <AdminLayoutActions>
      <Button variant="outline">Export</Button>
      <Button onClick={() => router.visit('/admin/users/create')}>
        Create User
      </Button>
    </AdminLayoutActions>
  </AdminLayoutHeader>

  <AdminLayoutContent>
    <Table>
      {/* table content */}
    </Table>
  </AdminLayoutContent>

  <AdminLayoutFooter>
    <p className="text-sm text-muted-foreground">
      Showing {users.data.length} of {users.total} users
    </p>
    {/* Pagination here */}
  </AdminLayoutFooter>
</AdminLayout>
```

## Example: Form Page

```tsx
<AdminLayout>
  <AdminLayoutHeader>
    <AdminLayoutTitle
      title="Create User"
      description="Add a new user to your site"
    />
  </AdminLayoutHeader>

  <AdminLayoutContent>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        {/* Form fields */}
      </div>
    </form>
  </AdminLayoutContent>

  <AdminLayoutFooter>
    <Button variant="outline" onClick={() => router.visit('/admin/users')}>
      Cancel
    </Button>
    <Button type="submit" disabled={processing}>
      Create User
    </Button>
  </AdminLayoutFooter>
</AdminLayout>
```
