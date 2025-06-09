import React from 'react';
import { Header } from './components/Layout/Header';
import { Container } from './components/Layout/Container';

function App(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <Container>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">設定</h2>
            <p className="text-gray-600">
              計算プリントの設定を行うコンポーネントが表示されます。
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default App;
