const money = (value) => `\u20A6${Number(value || 0).toLocaleString()}`

export default function FeeReceipt({ student, school, term, session, receipt, statement }) {
  const isStatement = Boolean(statement)
  const fees = statement?.fees || []
  const payments = statement?.payments || []
  const totals = statement?.totals || {}

  return (
    <div id="fee-receipt" className="bg-white p-6 text-navy-900 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-navy-800 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">{school?.name || 'Witty Academy'}</p>
          <h2 className="mt-1 text-xl font-extrabold text-navy-900">{isStatement ? 'Fee Payment Statement' : 'Payment Receipt'}</h2>
          {school?.location && <p className="mt-0.5 text-xs text-slate-500">{school.location}</p>}
          {school?.motto && <p className="text-xs italic text-slate-400">{school.motto}</p>}
        </div>
        <div className="text-right text-xs text-slate-500">
          <p className="font-bold text-navy-900">{isStatement ? 'STATEMENT' : 'RECEIPT'}</p>
          <p>{isStatement ? `Generated ${new Date().toLocaleDateString('en-GB')}` : receipt?.receiptNo || receipt?.code}</p>
          {!isStatement && <p>{receipt?.paidOn || receipt?.date}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-navy-50/60 p-4 text-sm sm:grid-cols-2">
        <Info label="Student" value={student?.name} />
        <Info label="Student ID" value={student?.studentId} />
        <Info label="Class" value={student?.className} />
        <Info label="Session" value={session || statement?.session} />
        <Info label="Term" value={term || statement?.term} />
        <Info label="Status" value={isStatement ? (statement?.completed ? 'Fees Completed' : 'Outstanding Balance') : receipt?.status} />
      </div>

      {isStatement ? (
        <>
          <div className="mt-5 overflow-hidden rounded-xl border border-navy-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-3 py-2 font-semibold">Fee Item</th>
                  <th className="px-3 py-2 text-right font-semibold">Billed</th>
                  <th className="px-3 py-2 text-right font-semibold">Paid</th>
                  <th className="px-3 py-2 text-right font-semibold">Balance</th>
                  <th className="px-3 py-2 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {fees.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-navy-900">{fee.title || 'School Fees'}</p>
                      {fee.items?.length > 0 && (
                        <p className="mt-0.5 text-[10px] text-slate-400">{fee.items.map((item) => item.label).join(' • ')}</p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold">{money(fee.due)}</td>
                    <td className="px-3 py-2.5 text-right text-emerald-700">{money(fee.paid)}</td>
                    <td className="px-3 py-2.5 text-right text-rose-600">{money(fee.balance)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">{fee.status}</td>
                  </tr>
                ))}
                {!fees.length && <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No fee records.</td></tr>}
              </tbody>
              <tfoot className="bg-navy-50 font-bold text-navy-900">
                <tr>
                  <td className="px-3 py-2.5">Total</td>
                  <td className="px-3 py-2.5 text-right">{money(totals.due)}</td>
                  <td className="px-3 py-2.5 text-right">{money(totals.paid)}</td>
                  <td className="px-3 py-2.5 text-right">{money(totals.balance)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-bold text-navy-900">Payment History</h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-navy-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-50 text-navy-700">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Receipt</th>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Method</th>
                    <th className="px-3 py-2 text-right font-semibold">Amount</th>
                    <th className="px-3 py-2 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-3 py-2 font-mono font-semibold">{payment.receiptNo || payment.code}</td>
                      <td className="px-3 py-2">{payment.paidOn}</td>
                      <td className="px-3 py-2">{payment.method}</td>
                      <td className="px-3 py-2 text-right font-semibold">{money(payment.amount)}</td>
                      <td className="px-3 py-2 text-right">{payment.status}</td>
                    </tr>
                  ))}
                  {!payments.length && <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">No payments recorded.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5">
          <div className="rounded-xl border border-navy-100">
            <Row label="Purpose" value={receipt?.purpose} />
            <Row label="Amount Paid" value={money(receipt?.amount)} strong />
            <Row label="Payment Method" value={receipt?.method} />
            <Row label="Reference" value={receipt?.reference || '—'} />
            <Row label="Status" value={receipt?.status} />
            {receipt?.balance !== undefined && <Row label="Outstanding Balance" value={money(receipt.balance)} />}
          </div>
          <p className="mt-4 text-center text-[10px] text-slate-400">
            This receipt confirms payment recorded by the school bursary. Keep it for your records.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-end justify-between border-t border-navy-100 pt-4 text-[10px] text-slate-400">
        <p>{school?.name || 'Witty Academy'} • {school?.mottoArabicPlain || ''}</p>
        <p>Generated {new Date().toLocaleString('en-GB')}</p>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-bold text-navy-900">{value || '—'}</p>
    </div>
  )
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between border-b border-navy-50 px-4 py-3 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? 'text-lg font-extrabold text-navy-900' : 'font-semibold text-navy-900'}>{value}</span>
    </div>
  )
}
