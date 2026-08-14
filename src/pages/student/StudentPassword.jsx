import PageHeader from '../../components/ui/PageHeader'
import { ChangePassword } from '../teacher/TeacherProfile'

export default function StudentPassword() {
  return (
    <div>
      <PageHeader title="Change Password" subtitle="Keep your account secure" />
      <ChangePassword />
    </div>
  )
}