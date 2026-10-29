import Modal from '../../../components/common/Modal';

// 회화 문장을 크게 띄워 상대에게 보여 주는 창 (요구사항 #92). 일본어를 가장 크게, 한국어 뜻은 작게 둔다.
export default function PhraseShowDialog({ phrase, onClose }) {
  return (
    <Modal open={phrase !== null} onClose={onClose} title={phrase?.ko ?? ''}>
      {phrase ? (
        <div className="space-y-3 py-4 text-center">
          <p lang="ja" className="text-display font-bold break-keep">
            {phrase.ja}
          </p>
          <p className="text-body text-text/70">{phrase.reading}</p>
        </div>
      ) : null}
    </Modal>
  );
}
