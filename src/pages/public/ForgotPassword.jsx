import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import SiteNav from '../../components/layout/SiteNav'
import Button from '../../components/ui/Button'
import { auth } from '../../services/api'

const inputCls =
  'w-full rounded-xl border border-navy-100 bg-white py-3 pl-10 pr-10 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-100'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const requestCode = async (event) => {
    event?.preventDefault()
    if (loading) return
    setError('')
    setNotice('')
    setLoading(true)
    try {
      const res = await auth.forgotPassword(email.trim())
      setNotice(res.message || 'If the email is registered, a 6-digit verification code has been sent.')
      setStep('reset')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (event) => {
    event.preventDefault()
    if (loading) return
    setError('')
    setNotice('')

    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await auth.resetPassword({ email: email.trim(), code, password, confirmPassword })
      setDone(true)
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <SiteNav />
      <div className="mx-auto flex min-h-[80vh] max-w-lg items-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl border border-navy-100 bg-white p-8 shadow-lift sm:p-10"
        >
          {done ? (
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </span>
              <h1 className="mt-5 text-2xl font-extrabold text-navy-900">Password Reset</h1>
              <p className="mt-2 text-sm text-slate-500">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-800 text-gold-400">
                <KeyRound size={22} />
              </span>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900">Forgot password?</h1>
              <p className="mt-1 text-sm text-slate-500">
                {step === 'email'
                  ? 'Enter the email address linked to your portal account and we will send you a 6-digit verification code.'
                  : `Enter the code sent to ${email} and choose a new password.`}
              </p>

              {step === 'email' ? (
                <form onSubmit={requestCode} className="mt-7 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-800">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        className={inputCls}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{error}</p>}

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Sending code…</span> : 'Send Verification Code'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={resetPassword} className="mt-7 space-y-4">
                  {notice && <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">{notice}</p>}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-800">6-Digit Code</label>
                    <div className="relative">
                      <KeyRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        autoComplete="one-time-code"
                        className={`${inputCls} tracking-[0.4em]`}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-800">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={show ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        className={inputCls}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-700">
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-800">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={show ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        className={inputCls}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{error}</p>}

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Resetting…</span> : 'Reset Password'}
                  </Button>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <button type="button" onClick={() => { setStep('email'); setError(''); setNotice(''); setCode('') }} className="inline-flex items-center gap-1 text-navy-700 hover:underline">
                      <ArrowLeft size={13} /> Change email
                    </button>
                    <button type="button" onClick={requestCode} disabled={loading} className="text-navy-700 hover:underline disabled:text-slate-300">
                      Resend code
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-6 text-center text-xs text-slate-400">
                Remembered it? <Link to="/login" className="font-semibold text-navy-700">Back to login</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
