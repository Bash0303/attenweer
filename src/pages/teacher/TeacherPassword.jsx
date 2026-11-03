import PageHeader from '../../components/ui/PageHeader'
import { ChangePassword } from './TeacherProfile'

export default function TeacherPassword() {
  return (
    <div>
      <PageHeader title="Change Password" subtitle="Keep your staff account secure" />
      <ChangePassword />
    </div>
  )
}
