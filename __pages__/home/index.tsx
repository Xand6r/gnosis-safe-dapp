import React from 'react';
import { Menu, Spin } from 'antd';
import type { NextPage } from 'next';
import { LoadingOutlined } from '@ant-design/icons';

import NoSafe from 'components/nosafe';
import { useFetchSafe } from 'hooks/safe/usefetchsafe';
import SafeInformation from './components/safeinformation';

const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;

const Home: NextPage = () => {
  const { safes, loading, activeSafe, setCurrentSafe, noSafe, addNewSafe } =
    useFetchSafe();

  return (
    <Spin
      indicator={antIcon}
      spinning={loading}
      tip="Loading safes associated with this ethereum account..."
    >
      <div style={{ display: 'flex' }}>
        {activeSafe && (
          <>
            <aside>
              <Menu
                onClick={setCurrentSafe}
                style={{ width: 256 }}
                defaultSelectedKeys={[activeSafe]}
                defaultOpenKeys={['safes']}
                mode="inline"
                items={safes}
              />
            </aside>
            <SafeInformation onAddSafe={addNewSafe} activeSafe={activeSafe} />
          </>
        )}

        {noSafe && (
          <NoSafe
            onAddSafe={addNewSafe}
            text="There are no safes associated with this account."
          />
        )}
      </div>
    </Spin>
  );
};

export default Home;
