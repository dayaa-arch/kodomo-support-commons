import {
  CHILD_CONSULTATION_CONTACTS,
  EMERGENCY_CALL_CONTACTS,
  type EmergencyContact,
} from "../domain/emergency-contacts";
import { toTelHref } from "../domain/phone";
import { Icon } from "./Icon";

function ConsultationCard({ contact }: { readonly contact: EmergencyContact }) {
  return (
    <a
      href={toTelHref(contact.phone)}
      className="flex flex-col gap-1 rounded-xl border border-coral-200 bg-white p-4 transition hover:border-coral-400 hover:bg-coral-50/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
    >
      <span className="font-black text-slate-900">{contact.name}</span>
      <span className="inline-flex items-center gap-2 text-lg font-black text-coral-700">
        <Icon name="phone" className="size-5 shrink-0" />
        {contact.phone}
        <span className="sr-only">に電話をかける</span>
      </span>
      <span className="text-xs font-bold text-slate-500">{contact.availability}</span>
      <span className="mt-1 text-sm leading-6 text-slate-700">{contact.description}</span>
    </a>
  );
}

export function EmergencyContacts() {
  return (
    <section
      aria-labelledby="emergency-heading"
      className="rounded-2xl border border-coral-300 bg-coral-50 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-coral-700 shadow-sm">
          <Icon name="alert" />
        </span>
        <div>
          <h2 id="emergency-heading" className="text-lg font-black text-coral-900">
            今すぐ助けが必要な場合
          </h2>
          <p className="mt-1 text-sm leading-6 text-coral-800">
            つらいとき、話を聞いてくれるところがあります。緊急のことでなくても大丈夫です。
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {CHILD_CONSULTATION_CONTACTS.map((contact) => (
          <ConsultationCard key={contact.name} contact={contact} />
        ))}
      </div>

      <div className="mt-5 border-t border-coral-200 pt-4">
        <h3 className="text-sm font-black text-coral-900">
          いのちや身体に関わる危険があるとき
        </h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {EMERGENCY_CALL_CONTACTS.map((contact) => (
            <li key={contact.name}>
              <a
                href={toTelHref(contact.phone)}
                className="flex min-h-10 items-center gap-2 rounded-lg border border-coral-200 bg-white px-3 py-2 transition hover:border-coral-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
              >
                <Icon name="phone" className="size-4 shrink-0 text-coral-700" />
                <span className="min-w-0">
                  <span className="block text-sm font-black text-coral-800">{contact.name}</span>
                  <span className="block text-xs text-slate-500">{contact.description}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
