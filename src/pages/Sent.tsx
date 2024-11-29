import EmailList from "@/components/ui/EmailList";

export default function Sent() {
	return <EmailList fetchUrl="/sent" title="Sent emails" emailType={"sent"} />;
}
