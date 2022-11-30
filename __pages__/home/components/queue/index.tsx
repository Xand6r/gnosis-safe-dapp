import { Spin, Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import Safe from '@gnosis.pm/safe-core-sdk';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';

import { useSafeServiceClient } from 'hooks/safe/usesafeserviceclient';
import styles from './queue.module.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

export default function Queue({
  safe,
  refresh
}: {
  safe: Safe | undefined;
  refresh: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const { getAllQueuedTransactions, approveSafeTransactions } =
    useSafeServiceClient();

  function refreshQueuedTransactions() {
    if (!safe) return;
    setLoading(true);
    getAllQueuedTransactions(safe.getAddress())
      .then((transactions) => {
        setTransactions(transactions);
      })
      .finally(() => {
        setLoading(false);
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
      toast.success('Transaction Sucesfully executed');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin indicator={antIcon} spinning={loading} tip="Executing Transaction..">
      <div className={styles.queuewrapper}>
        {transactions.map((t: any) => (
          <div
            onClick={() => approveAndExecute(safe, t.safeTxHash)}
            key={t.safeTxHash}
          >
            <section>
              Approve Token
              <span>{t.dataDecoded.method}</span> to
              <span>{t.dataDecoded.parameters[0].value}</span>
            </section>
          </div>
        ))}
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
