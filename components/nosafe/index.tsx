import type { NextPage } from 'next';
import Image from 'next/image';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './nosafe.module.scss';
import { useCreateSafe } from 'hooks/safe/usecreatesafe';
import { toast } from 'react-toastify';
const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

const NoSafe: NextPage<{
  text: String;
  onAddSafe: (addr: string) => Promise<void>;
}> = ({ text, onAddSafe }) => {
  const { createSafe, loading } = useCreateSafe();
  const localCreateSafe = async () => {
    try {
      const createdSafe = await createSafe();
      const address =  createdSafe.getAddress();
      onAddSafe(address);
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <Spin indicator={antIcon} spinning={loading} tip="Creating safe...">
      <section className={styles.nosafe}>
        <div>
          <Image layout="fill" src="/assets/void.png" alt="" />
        </div>
        <h2>{text}</h2>
        <div className={styles.buttonWrapper}>
          <Button onClick={localCreateSafe} type="primary">
            Create A Safe
          </Button>
        </div>
      </section>
    </Spin>
  );
};

export default NoSafe;
