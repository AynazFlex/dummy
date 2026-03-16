import { useAuth, useProducts } from "@/hooks";
import { ProductsTable } from "@/widgets";
import { Button, Flex, Stack, TextInput, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconLogout, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const Home = () => {
  const [value, setValue] = useState<string>();
  const [debounced] = useDebouncedValue(value, 300);
  const setSearch = useProducts((state) => state.setSearch);
  const logout = useAuth((state) => state.logout);
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    setSearch(debounced);
  }, [debounced]);

  return (
    <Stack gap="30px" px="lg">
      <Flex gap="lg" mt="20px">
        <Title order={3}>Товары</Title>
        <TextInput
          leftSection={<IconSearch size={18} />}
          placeholder="Найти"
          style={{
            flexGrow: 1,
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="default" leftSection={<IconLogout size={18} />} onClick={handleLogout}>Выйти</Button>
      </Flex>
      <ProductsTable />
    </Stack>
  );
};
