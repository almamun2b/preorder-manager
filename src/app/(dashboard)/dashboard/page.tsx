import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <main className="">
      <h1 className="mb-6 text-3xl font-bold">Welcome to Preorder Manager</h1>
      <p className="mb-10 text-muted-foreground">
        Manage your product preorders efficiently. Use filters, sorting, and
        pagination to stay on top of preorder activity.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Preorders</CardTitle>
          </CardHeader>
          <CardContent>
            View, filter, and manage all preorders in one place.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Preorder</CardTitle>
          </CardHeader>
          <CardContent>
            Add new preorder records with flexible start and end dates.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update & Status</CardTitle>
          </CardHeader>
          <CardContent>
            Edit existing preorders, toggle active/inactive status, or delete
            records instantly.
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
