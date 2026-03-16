import { Navigate } from "react-router";
import { useAuth } from "@/hooks";
import { useForm } from "@mantine/form";
import {
  Button,
  Center,
  Checkbox,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLock, IconUser } from "@tabler/icons-react";

interface ILoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

export const Login = () => {
  const form = useForm<ILoginFormValues>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validate: {
      username: (value) => (value ? null : "Логин обязателен"),
      password: (value) => (value ? null : "Пароль обязателен"),
    },
  });
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isLoginLoading = useAuth((state) => state.isLoginLoading);
  const login = useAuth((state) => state.login);
  const auth = useAuth((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (data: ILoginFormValues) => {
    const { username, password, remember } = data;
    try {
      await login({
        username,
        password,
        rememberMe: remember,
      });
      await auth();
    } catch (error) {
      notifications.show({
        title: "Ошибка входа",
        message: (error as Error).message,
        color: "red",
        withCloseButton: true,
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <Center mih="100vh">
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title ta="center" order={1} mb="md">
          Добро пожаловать!
        </Title>
        <Text ta="center" mb="xs">
          Пожалуйста, авторизируйтесь
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" w={420}>
            <TextInput
              leftSection={<IconUser size={18} />}
              withAsterisk
              label="Логин"
              placeholder="Введите логин"
              key={form.key("username")}
              {...form.getInputProps("username")}
            />
            <PasswordInput
              leftSection={<IconLock size={18} />}
              withAsterisk
              label="Пароль"
              placeholder="Введите пароль"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Checkbox
              label="Запомнить данные"
              key={form.key("remember")}
              {...form.getInputProps("remember", { type: "checkbox" })}
            />
            <Button
              type="submit"
              disabled={isLoginLoading}
              loading={isLoginLoading}
            >
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};
