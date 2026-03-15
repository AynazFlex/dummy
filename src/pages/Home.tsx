import { useAuth, useProducts } from "@/hooks";
import { ProductsTable } from "@/widgets";
import { Button, Flex, Stack, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useLayoutEffect, useState } from "react";

export const Home = () => {
  const [value, setValue] = useState<string>();
  const [debounced] = useDebouncedValue(value, 300);
  const setSearch = useProducts((state) => state.setSearch);
  const logout = useAuth((state) => state.logout);
  const handleLogout = () => {
    logout();
  };

  useLayoutEffect(() => {
    setSearch(debounced);
  }, [debounced]);

  return (
    <Stack gap="30px">
      <Flex gap="sm" mt="20px">
        <TextInput
          style={{
            flexGrow: 1,
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={handleLogout}>Выйти</Button>
      </Flex>
      <ProductsTable />
    </Stack>
  );
};
