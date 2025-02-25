import { Logs } from "@/types/Sync";
import { Flex, Loader, Skeleton, Text, Timeline } from "@mantine/core";
import moment from "moment";

export default function SyncTimeline({ data }: { data: Logs | null }) {
    const format = "YYYY-MM-DD HH:mm:ss";
    if (!data) {
        return (
            <Flex gap={8} direction={"column"}>
                {new Array(10).fill(null).map((_data, idx) => (
                    <Skeleton key={idx} w={"100%"} h={32} />
                ))}
            </Flex>
        );
    }

    return (
        <>
            <Timeline active={data.isSyncing ? 0 : -1} lineWidth={2}>
                {data.isSyncing ? (
                    <Timeline.Item bullet={<Loader />} title={moment(data.logs[0].ran_at).format(format)}>
                        <Text c={"dimmed"}>Database is syncing right now</Text>
                        <Text>Syncing started {moment(data.logs[0].ran_at).fromNow(true)} ago ...</Text>
                    </Timeline.Item>
                ) : (
                    <></>
                )}

                {data.logs.map((log, idx) => {
                    if (data.isSyncing && idx === 0) {
                        // Skip first if database is syncing
                        return <></>;
                    }

                    return (
                        <Timeline.Item bullet title={moment(log.ran_at).format(format)}>
                            <Text c={"dimmed"}>
                                Syncing started at {moment(log.ran_at).format(format)} and ended at{" "}
                                {moment(log.finished_at).format(format)}
                            </Text>
                            <Text>Lasting {moment(log.ran_at).from(moment(log.finished_at), true)}</Text>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
            {data.logs.length === 0 ? <Text c={"dimmed"}>No sync logs available</Text> : <></>}
        </>
    );
}
