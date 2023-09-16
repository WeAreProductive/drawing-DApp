import gql from "graphql-tag";
import * as Urql from "urql";
//@TODO update graphql schema

export const NoticeDocument = gql`
  query notice($id: ID!) {
    notice(id: $id) {
      id
      payload
      index
      keccak
      proof {
        outputHashesRootHash
        vouchersEpochRootHash
        noticesEpochRootHash
        machineStateHash
        keccakInHashesSiblings
        outputHashesInEpochSiblings
      }
      input {
        index
        epoch {
          index
        }
      }
    }
  }
`;

export function useNoticeQuery(options) {
  return Urql.useQuery;
}
export const NoticesDocument = gql`
  query notices {
    notices {
      nodes {
        id
        index
        payload
        input {
          index
          epoch {
            index
          }
        }
      }
    }
  }
`;

export function useNoticesQuery(options = null) {
  return Urql.useQuery({ query: NoticesDocument, ...options });
}
export const NoticesByEpochAndInputDocument = gql`
  query noticesByEpochAndInput($epoch_index: Int!, $input_index: Int!) {
    epoch: epochI(index: $epoch_index) {
      input(index: $input_index) {
        notices {
          nodes {
            id
            index
            payload
            input {
              index
              epoch {
                index
              }
            }
          }
        }
      }
    }
  }
`;

export function useNoticesByEpochAndInputQuery(options = null) {
  return Urql.useQuery({ query: NoticesByEpochAndInputDocument, ...options });
}
export const NoticesByEpochDocument = gql`
  query noticesByEpoch($epoch_index: Int!) {
    epoch: epochI(index: $epoch_index) {
      inputs {
        nodes {
          notices {
            nodes {
              id
              index
              payload
              input {
                index
                epoch {
                  index
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useNoticesByEpochQuery(options = null) {
  return Urql.useQuery({ query: NoticesByEpochDocument, ...options });
}
export const VoucherDocument = gql`
  query voucher($id: ID!) {
    voucher(id: $id) {
      id
      destination
      payload
      index
      proof {
        outputHashesRootHash
        vouchersEpochRootHash
        noticesEpochRootHash
        machineStateHash
        keccakInHashesSiblings
        outputHashesInEpochSiblings
      }
      input {
        index
        epoch {
          index
        }
      }
    }
  }
`;

export function useVoucherQuery(options = null) {
  return Urql.useQuery({ query: VoucherDocument, ...options });
}
export const VouchersDocument = gql`
  query vouchers {
    vouchers {
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
        }
      }
    }
  }
`;

export function useVouchersQuery(options) {
  return Urql.useQuery({ query: VouchersDocument, ...options });
}
export const VouchersByEpochAndInputDocument = gql`
  query vouchersByEpochAndInput($epoch_index: Int!, $input_index: Int!) {
    epoch: epochI(index: $epoch_index) {
      input(index: $input_index) {
        vouchers {
          nodes {
            id
            index
            destination
            payload
            input {
              index
              epoch {
                index
              }
            }
          }
        }
      }
    }
  }
`;

export function useVouchersByEpochAndInputQuery(options = null) {
  return Urql.useQuery({ query: VouchersByEpochAndInputDocument, ...options });
}
export const VouchersByEpochDocument = gql`
  query vouchersByEpoch($epoch_index: Int!) {
    epoch: epochI(index: $epoch_index) {
      inputs {
        nodes {
          vouchers {
            nodes {
              id
              index
              destination
              payload
              input {
                index
                epoch {
                  index
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useVouchersByEpochQuery(options = null) {
  return Urql.useQuery({ query: VouchersByEpochDocument, ...options });
}
export const ReportDocument = gql`
  query report($id: ID!) {
    report(id: $id) {
      id
      payload
      index
      input {
        index
        epoch {
          index
        }
      }
    }
  }
`;

export function useReportQuery(options) {
  return Urql.useQuery < ReportQuery > { query: ReportDocument, ...options };
}
export const ReportsDocument = gql`
  query reports {
    reports {
      nodes {
        id
        index
        payload
        input {
          index
          epoch {
            index
          }
        }
      }
    }
  }
`;

export function useReportsQuery(options = null) {
  return Urql.useQuery({ query: ReportsDocument, ...options });
}
export const ReportsByEpochAndInputDocument = gql`
  query reportsByEpochAndInput($epoch_index: Int!, $input_index: Int!) {
    epoch: epochI(index: $epoch_index) {
      input(index: $input_index) {
        reports {
          nodes {
            id
            index
            payload
            input {
              index
              epoch {
                index
              }
            }
          }
        }
      }
    }
  }
`;

export function useReportsByEpochAndInputQuery(options) {
  return Urql.useQuery({ query: ReportsByEpochAndInputDocument, ...options });
}
export const ReportsByEpochDocument = gql`
  query reportsByEpoch($epoch_index: Int!) {
    epoch: epochI(index: $epoch_index) {
      inputs {
        nodes {
          reports {
            nodes {
              id
              index
              payload
              input {
                index
                epoch {
                  index
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useReportsByEpochQuery(options) {
  return Urql.useQuery({ query: ReportsByEpochDocument, ...options });
}
