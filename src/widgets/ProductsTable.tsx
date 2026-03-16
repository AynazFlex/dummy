import { useProducts, useProductsQuery } from "@/hooks";
import {
  ActionIcon,
  Box,
  Checkbox,
  Flex,
  Loader,
  LoadingOverlay,
  Pagination,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconRefresh,
} from "@tabler/icons-react";
import { ProductFormModal } from "./ProductForm";

const TableHead = {
  title: "Наименование",
  brand: "Вендер",
  sku: "Артикул",
  rating: "Оценка",
  price: "Цена, ₽",
};

export const ProductsTable = () => {
  const setSort = useProducts((state) => state.setSort);
  const setSkip = useProducts((state) => state.setSkip);
  const skip = useProducts((state) => state.skip);
  const limit = useProducts((state) => state.limit);
  const order = useProducts((state) => state.order);
  const sortBy = useProducts((state) => state.sortBy);
  const selectedProducts = useProducts((state) => state.selectedProducts);
  const setSelectedProducts = useProducts((state) => state.setSelectedProducts);
  const { data, isFetching, refetch } = useProductsQuery();

  const rows = data?.products?.map((product) => (
    <Table.Tr
      key={product.id}
      bg={
        selectedProducts.includes(product.id)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          checked={selectedProducts.includes(product.id)}
          onChange={(event) =>
            setSelectedProducts(
              event.currentTarget.checked
                ? [...selectedProducts, product.id]
                : selectedProducts.filter((item) => item !== product.id),
            )
          }
        />
      </Table.Td>
      <Table.Td>{product.title}</Table.Td>
      <Table.Td>{product.brand}</Table.Td>
      <Table.Td>{product.sku}</Table.Td>
      <Table.Td>
        <Box component="span" c={product.rating < 3 ? "red" : undefined}>
          {product.rating}
        </Box>
        /5
      </Table.Td>
      <Table.Td>{product.price}</Table.Td>
    </Table.Tr>
  ));

  const isAllChecked = !!data?.products.every(({ id }) =>
    selectedProducts.includes(id),
  );

  return (
    <Stack gap="40px">
      <Flex justify="space-between" align="center">
        <Text>Все позиции</Text>
        <Flex gap="sm" align="center">
          <ActionIcon disabled={isFetching} onClick={() => refetch()} variant="default">
            <IconRefresh size={20} />
          </ActionIcon>
          <ProductFormModal />
        </Flex>
      </Flex>
      {data?.products.length ? (
        <>
          <Box pos="relative">
            <LoadingOverlay
              visible={isFetching}
              loaderProps={{ children: <Loader type="bars" /> }}
            />
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Checkbox
                      indeterminate={
                        !isAllChecked &&
                        data.products.some(({ id }) =>
                          selectedProducts.includes(id),
                        )
                      }
                      checked={isAllChecked}
                      onChange={(event) =>
                        event.currentTarget.checked
                          ? setSelectedProducts([
                              ...selectedProducts,
                              ...data.products.map(({ id }) => id),
                            ])
                          : setSelectedProducts(
                              selectedProducts.filter(
                                (item) =>
                                  !data.products
                                    .map(({ id }) => id)
                                    .includes(item),
                              ),
                            )
                      }
                    />
                  </Table.Th>
                  {Object.entries(TableHead).map(([key, value]) => (
                    <Table.Th key={key}>
                      <UnstyledButton onClick={() => setSort(key)}>
                        <Flex align="center">
                          {value}
                          {sortBy === key &&
                            (order === "asc" ? (
                              <IconArrowNarrowUp size={18} />
                            ) : (
                              <IconArrowNarrowDown size={18} />
                            ))}
                        </Flex>
                      </UnstyledButton>
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Box>
          <Flex justify="end">
            <Pagination
              total={Math.ceil(data.total / limit)}
              onChange={(page) => setSkip(limit * (page - 1))}
              value={skip / limit + 1}
            />
          </Flex>
        </>
      ) : (
        <Text ta="center">Нет данных</Text>
      )}
    </Stack>
  );
};
