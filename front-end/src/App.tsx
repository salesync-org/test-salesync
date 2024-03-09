import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// const LogIn = lazy(() => import('pages/LogIn/LogIn'));
// const Setting = lazy(() => import('pages/Setting/Setting'));
const Cheatsheet = lazy(() => import('pages/Cheatsheet/Cheatsheet'));
const ConfigLayout = lazy(() => import('./components/Layout/ConfigLayout'));
// const TypeDetail = lazy(() => import('./pages/TypeDetail/TypeDetail'));
// const TypeManager = lazy(() => import('./pages/TypeManager/TypeManager'));
const RecordsLayout = lazy(() => import('./pages/Records/RecordsLayout'));
const Sales = lazy(() => import('./pages/Sales/Sales'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<ConfigLayout />}>
            <Route path='cheatsheet' element={<Cheatsheet />} />
            {/* <Route path='/' element={<LogIn />} />
            <Route path='setting' element={<Setting />} />
            <Route path='type' element={<TypeDetail />} />
            <Route path='type/link/:id' element={<TypeDetail />} />
            <Route path='field' element={<TypeDetail />} />
            <Route path='link' element={<TypeDetail />} />
            <Route path='/type-manager' element={<TypeManager />} /> */}
          </Route>
          <Route path='/records' element={<RecordsLayout />}>
            <Route path='sales' element={<Sales />} />
            <Route path='*' element={<Sales />} />
          </Route>
          <Route path='/records' element={<RecordsLayout />}>
            <Route path='sales' element={<Sales />} />
            <Route path='*' element={<Sales />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
