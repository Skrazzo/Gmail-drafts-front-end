import EmailList from "@/components/ui/EmailList";

export default function Inbox() {
	return <EmailList fetchUrl="/inbox" title="Inbox" emailType={"inbox"} />;
}
