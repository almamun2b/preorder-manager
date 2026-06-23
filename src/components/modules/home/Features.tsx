import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

const features = [
  'Filter preorders by All, Active, Inactive',
  'Sort and paginate results from the database',
  'Toggle status and delete records with instant feedback',
  'Create and update preorders with pre-filled forms',
  'Navigation and loading states for smooth UX',
]

export function Features() {
  return (
    <section className="py-40">
      <h2 className="mb-10 text-center text-2xl font-semibold">
        What You Can Do
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {feature}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature} is fully supported in the Preorder Manager.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
