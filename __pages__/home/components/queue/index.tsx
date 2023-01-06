import { Spin, Alert, Tag } from 'antd';

import React, { useEffect, useState } from 'react';
import Safe from '@gnosis.pm/safe-core-sdk';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';

import { useSafeServiceClient } from 'hooks/safe/usesafeserviceclient';
import styles from './queue.module.scss';
import { useWeb3React } from '@web3-react/core';

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

export default function Queue({
  safe,
  refresh
}: {
  safe: Safe | undefined;
  refresh: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [tip, setTip] = useState('');
  const [transactions, setTransactions] = useState([]);
  const { account } = useWeb3React();

  const { getAllQueuedTransactions, approveSafeTransactions } =
    useSafeServiceClient();

  function refreshQueuedTransactions() {
    if (!safe) return;
    setLoading(true);
    setTip('Loading pending transactions');
    getAllQueuedTransactions(safe.getAddress())
      .then((transactions) => {
        console.log({ transactions });
        setTransactions(transactions);
      })
      .finally(() => {
        setLoading(false);
        setTip('Approving transaction...');
      });
  }

  useEffect(() => {
    refreshQueuedTransactions();
  }, [refresh]);

  const approveAndExecute = async (safe: Safe | undefined, hash: string) => {
    if (!safe) return;
    try {
      if (loading) return;
      setLoading(true);
      await approveSafeTransactions(safe, hash);
      refreshQueuedTransactions();
      toast.success('Transaction Sucesfully executed...');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin indicator={antIcon} spinning={loading} tip={tip}>
      <div
        style={{ minHeight: loading ? '250px' : '0' }}
        className={styles.queuewrapper}
      >
        {transactions.map((txn: any) => {
          const {
            safeTxHash,
            dataDecoded,
            confirmations,
            confirmationsRequired
          } = txn;
          const gottenConfirmations = confirmations.length;
          // tag color should be grren if user has approved
          const tagColor = confirmations.find((c: any) => c.owner === account)
            ? 'green'
            : 'red';
          return (
            <div
              onClick={() => approveAndExecute(safe, safeTxHash)}
              key={safeTxHash}
            >
              <section>
                Approve Token
                <span>{dataDecoded.method}</span> to
                <span>{dataDecoded.parameters[0].value}</span>
                <b>
                  <Tag color={tagColor}>
                    {gottenConfirmations} OF {confirmationsRequired}{' '}
                    Confirmations
                  </Tag>
                </b>
              </section>
            </div>
          );
        })}
      </div>
      {!transactions.length && (
        <Alert
          message="There are no pending proposed transactions"
          type="warning"
        />
      )}
    </Spin>
  );
}
