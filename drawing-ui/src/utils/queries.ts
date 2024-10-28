import gql from "graphql-tag";
import * as Urql from "urql";
import { VouchersQuery, VouchersQueryVariables } from "../generated/graphql";
// export const VouchersWithProofDocument = gql`
//   query vouchers($cursor: String) {
//     vouchers(first: 10, after: $cursor) {
//       totalCount
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       edges {
//         node {
//           index
//           input {
//             index
//             notices {
//               edges {
//                 node {
//                   payload
//                 }
//               }
//             }
//           }
//           destination
//           payload
//           proof {
//             validity {
//               inputIndexWithinEpoch
//               outputIndexWithinInput
//               outputHashesRootHash
//               vouchersEpochRootHash
//               noticesEpochRootHash
//               machineStateHash
//               outputHashInOutputHashesSiblings
//               outputHashesInEpochSiblings
//             }
//             context
//           }
//         }
//       }
//     }
//   }
// `;
export const VouchersWithProofDocument = gql`
  query getVouchers {
    vouchers {
      edges {
        voucher: node {
          index
          input {
            index
            notices {
              edges {
                node {
                  payload
                }
              }
            }
          }
          destination
          payload
          proof {
            context
            validity {
              inputIndexWithinEpoch
              machineStateHash
              noticesEpochRootHash
              outputHashInOutputHashesSiblings
              outputHashesInEpochSiblings
              outputHashesRootHash
              outputIndexWithinInput
              vouchersEpochRootHash
            }
          }
        }
      }
    }
  }
`;
export function useVouchersWithProofQuery(
  options?: Omit<Urql.UseQueryArgs<VouchersQueryVariables>, "query">,
) {
  return Urql.useQuery<VouchersQuery, VouchersQueryVariables>({
    query: VouchersWithProofDocument,
    ...options,
  });
}
