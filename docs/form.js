
(() => {
  // --- Contact フォーム ---
  const form = document.querySelector('.t2-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const agree     = form.querySelector('input[name="agree"]');

  // 1) 同意チェック → 送信ボタンの有効/無効
  const syncSubmitState = () => {
    const disabled = !(agree && agree.checked);
    if (submitBtn) {
      submitBtn.disabled = disabled;
      submitBtn.setAttribute('aria-disabled', String(disabled));
    }
  };

  // 2) ★ここに“バリデーション一式”を置く（syncSubmitState() を呼ぶ前）
  //    （showErr / clearErr / invalidハンドラ / 入力中に消すハンドラ）
  const getErrElm = (el) => {
    if (!el.id) return null;
    return document.getElementById(el.id + '-err');
  };

  const showErr = (el, msg) => {
    const box = getErrElm(el);
    if (box) box.textContent = msg || '';
    el.setAttribute('aria-invalid', 'true');

    // エラー時だけ xxx-err を aria-describedby に追加
    const now = (el.getAttribute('aria-describedby') || '')
      .trim().split(/\s+/).filter(Boolean);
    const errId = el.id + '-err';
    if (!now.includes(errId)) {
      el.setAttribute('aria-describedby', [...now, errId].join(' '));
    }
  };

  const clearErr = (el) => {
    const box = getErrElm(el);
    if (box) box.textContent = '';
    el.removeAttribute('aria-invalid');

    // 解消時は xxx-err を aria-describedby から外す（ヒントだけに戻す）
    const kept = (el.getAttribute('aria-describedby') || '')
      .trim().split(/\s+/).filter(Boolean)
      .filter(id => id !== el.id + '-err');
    kept.length
      ? el.setAttribute('aria-describedby', kept.join(' '))
      : el.removeAttribute('aria-describedby');
  };

// HTML5 の invalid を横取りして日本語を出す（キャプチャで拾う）
form.addEventListener('invalid', (e) => {
  e.preventDefault();
  const el = e.target;
  let msg = '入力内容をご確認ください。';

  // お名前（必須）
  if (el.id === 'name' && el.validity.valueMissing) {
    msg = '必須項目です。入力してください。';

  // メール（必須 or 形式）
  } else if (el.id === 'email') {
    if (el.validity.valueMissing) {
      msg = '必須項目です。入力してください。';
    } else if (el.validity.typeMismatch) {
      msg = '有効なメールアドレス形式で入力してください。';
    }

  // ご用件（必須）
  } else if (el.id === 'topic' && el.validity.valueMissing) {
    msg = 'ご用件を選択してください。';

  // ご相談内容（必須）
  } else if (el.id === 'message' && el.validity.valueMissing) {
    msg = '必須項目です。入力してください。';

  // 同意（必須）
  } else if (el.id === 'agree' && el.validity.valueMissing) {
    msg = 'プライバシーポリシーに同意してください。';

  // その他の必須
  } else if (el.validity.valueMissing) {
    msg = '必須項目です。入力してください。';
  }

  showErr(el, msg);
}, true);



  // 入力/変更で直ったらエラーを消す
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    const handler = () => { if (el.checkValidity()) clearErr(el); };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  });
// 同意チェック：未チェックなら赤字を出す（ラベル内のリンク移動も拾う）
const agreeWrap = form.querySelector('.t2-checkbox');
if (agree) {
  const checkAgreeNow = () => {
    if (!agree.checked) {
      showErr(agree, 'プライバシーポリシーに同意してください。');
    } else {
      clearErr(agree);
    }
  };

  // 1) 状態が変わったら（チェック入れたら消える／外したら出す）
  agree.addEventListener('change', checkAgreeNow);

  // 2) ラベル全体からフォーカスが抜けたら判定（リンク→外 も拾える）
  if (agreeWrap) {
    agreeWrap.addEventListener('focusout', () => {
      // 次のフォーカスターゲットが確定してからチェック
      setTimeout(() => {
        const stillInside = agreeWrap.contains(document.activeElement);
        if (!stillInside) checkAgreeNow();
      }, 0);
    });
  }

  // 3) Enterで送信しようとしたら（ボタンが無効でも出す）
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !agree.checked) {
      e.preventDefault();
      checkAgreeNow();
      // 必要なら見失わないようにスクロール
      // agree.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}



  // 3) 初期化 & 同意チェックの監視
  syncSubmitState();
  if (agree) agree.addEventListener('change', syncSubmitState);

  // 4) 送信処理（デモ：実送信はしない）
  form.addEventListener('submit', (e) => {
    form.classList.add('was-validated');        // 初回送信以降だけエラー装飾
    if (!form.checkValidity()) {                // HTML5バリデーション
      e.preventDefault();
      form.reportValidity();                    // ブラウザのエラーバブル表示
      return;
    }
    e.preventDefault();                         // デモ：送信は止める
    if (submitBtn) submitBtn.disabled = true;

    // サンクスメッセージ（緑のボックス）をフォームの上に表示
    const done = document.createElement('p');
    done.className = 't2-form-done';
    done.textContent = '送信ありがとうございました。担当よりご連絡いたします。';
    done.setAttribute('role', 'status');
    done.setAttribute('aria-live', 'polite');
    done.setAttribute('aria-atomic', 'true');

    form.insertAdjacentElement('beforebegin', done);
    requestAnimationFrame(() => {
      done.classList.add('is-show');
      // フォーカス移動はしない（見た目すっきり/読み上げはされる）
    });

    // フォームを初期化
    form.reset();
    form.classList.remove('was-validated');
    syncSubmitState();

    // 数秒後にメッセージを自動で下げる（任意）
    setTimeout(() => {
      done.classList.remove('is-show');
      setTimeout(() => done.remove(), 250);
    }, 6000);
  });
})();
