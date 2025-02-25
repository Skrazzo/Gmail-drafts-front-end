import { Button, Group, Modal } from "@mantine/core";
import { ReactNode } from "react";

interface ModalFormProps {
    opened: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onConfirm: () => Promise<void> | void;
    loading?: boolean;
}

export function ModalForm({ opened, onClose, title, children, onConfirm, loading = false }: ModalFormProps) {
    return (
        <Modal opened={opened} onClose={onClose} title={title} size="lg">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onConfirm();
                }}
            >
                {children}

                <Group justify="right" mt="xl">
                    <Button variant="subtle" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        Confirm
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
