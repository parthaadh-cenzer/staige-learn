// Resource Vault, as a Builder Vault page.
//
// The directory itself is the platform's existing Vault page (src/pages/Vault.jsx)
// rendered in `embedded` mode — same search, same category chips, same pricing
// filters, same no-results state. Only the surrounding header differs, so there
// is exactly one searchable-directory implementation in the codebase.
import { useCourse } from '../../course/CourseContext'
import { resources, resourceCategories } from '../../data/appbuilder/resources'
import Vault from '../Vault'
import VaultPage from './VaultPage'

export default function VaultResources() {
  const { course } = useCourse()
  return (
    <VaultPage
      icon="Package" tone="flamingo"
      title={course.ui?.vault?.title || 'Resource Vault'}
      blurb="Everything you need to build beautiful websites and web apps—all in one place. No downloads. No outdated files. Just the best websites professionals actually use."
      stats={[`${resources.length} resources`, `${resourceCategories.length} categories`, 'Official links only']}
    >
      <p className="text-sm text-muted">
        Every card links to the project’s official website and opens in a new tab. Nothing is
        redistributed here, and none of these are referral links. Pricing badges are a rough guide —
        vendors change their tiers, so check the current terms on the site before you rely on one.
      </p>
      <Vault embedded />
    </VaultPage>
  )
}
