import { useAuth, useProducts, useProductsQuery } from "@/hooks";
import {
  Button,
  Center,
  Flex,
  Pagination,
  Stack,
  Table,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useLayoutEffect, useState } from "react";

export const Home = () => {
  const [value, setValue] = useState<string>();
  const [debounced] = useDebouncedValue(value, 300);
  const setSort = useProducts((state) => state.setSort);
  const setSkip = useProducts((state) => state.setSkip);
  const setSearch = useProducts((state) => state.setSearch);
  const skip = useProducts((state) => state.skip);
  const limit = useProducts((state) => state.limit);
  const { data } = useProductsQuery();
  const logout = useAuth((state) => state.logout);
  const handleLogout = () => {
    logout();
  };

  useLayoutEffect(() => {
    setSearch(debounced);
  }, [debounced]);

  const rows = data?.products?.map((product) => (
    <Table.Tr key={product.id}>
      <Table.Td>{product.title}</Table.Td>
      <Table.Td>{product.brand}</Table.Td>
      <Table.Td>{product.sku}</Table.Td>
      <Table.Td>{product.rating}</Table.Td>
      <Table.Td>{product.price}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Center p="md">
      <Stack gap="md">
        <Flex gap="sm">
          <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
          <Button onClick={handleLogout}>Выйти</Button>
        </Flex>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <UnstyledButton onClick={() => setSort("title")}>
                  Наименование
                </UnstyledButton>
              </Table.Th>
              <Table.Th>
                <UnstyledButton onClick={() => setSort("brand")}>
                  Вендер
                </UnstyledButton>
              </Table.Th>
              <Table.Th>
                <UnstyledButton onClick={() => setSort("sku")}>
                  Артикул
                </UnstyledButton>
              </Table.Th>
              <Table.Th>
                <UnstyledButton onClick={() => setSort("rating")}>
                  Оценка
                </UnstyledButton>
              </Table.Th>
              <Table.Th>
                <UnstyledButton onClick={() => setSort("price")}>
                  Цена, &#8381;
                </UnstyledButton>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows || "Нет данных"}</Table.Tbody>
        </Table>
        {data && (
          <Flex justify="end">
            <Pagination
              total={Math.ceil(data.total / limit)}
              onChange={(page) => setSkip(limit * (page - 1))}
              value={skip / limit + 1}
            />
          </Flex>
        )}
      </Stack>
    </Center>
  );
};
