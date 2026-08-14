import PageHeader from '../../components/ui/PageHeader'
import { ChangePassword } from '../teacher/TeacherProfile'

export default function ParentPassword() {
  return (
    <div>
      <PageHeader title="Change Password" subtitle="Keep your parent account secure" />
      <ChangePassword />
    </div>
  )
}