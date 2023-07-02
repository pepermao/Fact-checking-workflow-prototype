import { useCallback } from 'react';
import type { RemirrorJSON } from 'remirror';
import { OnChangeJSON } from '@remirror/react';
import { WysiwygEditor } from '@remirror/react-editors/wysiwyg';
import { YjsExtension } from 'remirror/extensions';
import Colaborating from './Colaborating';

const STORAGE_KEY = 'remirror-editor-content';

const ReviewForm: React.FC = () => {
  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    // Store the JSON in localstorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  }, []);

  return <MyEditor onChange={handleEditorChange} />;
};

interface MyEditorProps {
  onChange: (json: RemirrorJSON) => void;
}

const MyEditor: React.FC<MyEditorProps> = ({ onChange }) => {
  return (
    <div style={{ padding: 16 }}>
      <Colaborating />
    </div>
  );
};

export default ReviewForm;
