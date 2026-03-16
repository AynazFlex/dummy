import { Button, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import type { FC } from "react";

interface IProductFormValues {
  title: string;
  brand: string;
  sku: string;
  price: number;
}

const ProductForm: FC = () => {
  const form = useForm<IProductFormValues>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      brand: "",
      sku: "",
      price: 0,
    },
    validate: {
      title: (value) => (value ? null : "Поле обязателен"),
      brand: (value) => (value ? null : "Поле обязателен"),
      sku: (value) => (value ? null : "Поле обязателен"),
      price: (value) => (value ? null : "Поле обязателен"),
    },
  });

  const handleSubmit = (data: IProductFormValues) => {
    console.log(data);
    notifications.show({
      title: "Успех!",
      message: "Продукт успешно добавлен",
      color: "green",
      withCloseButton: true,
      position: "top-right",
      autoClose: 5000,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput
          withAsterisk
          label="Наименование"
          placeholder="Введите наименование"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />
        <TextInput
          withAsterisk
          label="Вендер"
          placeholder="Введите вендер"
          key={form.key("brand")}
          {...form.getInputProps("brand")}
        />
        <TextInput
          withAsterisk
          label="Артикул"
          placeholder="Введите aртикул"
          key={form.key("sku")}
          {...form.getInputProps("sku")}
        />
        <NumberInput
          withAsterisk
          label="Цена, ₽"
          placeholder="Введите цену"
          key={form.key("price")}
          {...form.getInputProps("price")}
        />
        <Button type="submit">Добавить продукт</Button>
      </Stack>
    </form>
  );
};

export const ProductFormModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Добавить продукт" centered>
        <ProductForm />
      </Modal>
      <Button leftSection={<IconPlus size={18} />} onClick={open}>Добавить</Button>
    </>
  );
};
