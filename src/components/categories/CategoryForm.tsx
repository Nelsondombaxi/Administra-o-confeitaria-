import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  Check,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';

import type { Category } from '../../types';

import type { CategoryFormData } from './CategoryModal';

interface CategoryFormProps {
  initialData?: Category | null;
  onSave: (
    data: CategoryFormData,
  ) => void | Promise<void>;
  onCancel: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function CategoryForm({
  initialData,
  onSave,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(initialData);
  const isBusy = uploading || saving;

  useEffect(() => {
    setName(initialData?.name ?? '');
    setDescription(initialData?.description ?? '');
    setImageUrl(initialData?.imageUrl ?? '');
    setErrorMessage('');
  }, [initialData]);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage('');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage(
        'Formato inválido. Use uma imagem JPG, PNG ou WEBP.',
      );

      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage(
        'A imagem é demasiado grande. O tamanho máximo é 5 MB.',
      );

      event.target.value = '';
      return;
    }

    try {
      setUploading(true);

      const fileExtension =
        file.name.split('.').pop()?.toLowerCase() || 'jpg';

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } =
        await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      if (!data.publicUrl) {
        throw new Error(
          'Não foi possível obter a URL da imagem.',
        );
      }

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error(
        'Erro ao fazer upload da imagem da categoria:',
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar a imagem.',
      );
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setErrorMessage('');
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setErrorMessage(
        'O nome da categoria é obrigatório.',
      );
      return;
    }

    if (trimmedName.length < 2) {
      setErrorMessage(
        'O nome da categoria deve ter pelo menos 2 caracteres.',
      );
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      await onSave({
        name: trimmedName,
        description: trimmedDescription,
        image_url: imageUrl.trim(),
      });
    } catch (error) {
      console.error(
        'Erro ao guardar categoria:',
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível guardar a categoria.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {errorMessage && (
        <div
          role="alert"
          className="
            flex items-start gap-3 rounded-xl
            border border-red-200 bg-red-50
            px-4 py-3 text-xs font-medium
            leading-5 text-red-700
          "
        >
          <span className="flex-1">
            {errorMessage}
          </span>

          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="
              shrink-0 cursor-pointer rounded-lg
              p-1 text-red-500 transition-colors
              hover:bg-red-100 hover:text-red-700
              focus:outline-none
              focus:ring-2 focus:ring-red-300
            "
            aria-label="Fechar mensagem de erro"
          >
            <X
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <label
              htmlFor="category-image"
              className="
                block text-xs font-bold
                text-[#2b1810]
              "
            >
              Imagem da categoria
            </label>

            <p className="mt-1 text-[10px] text-[#8c5338]">
              Uma imagem ajuda a identificar a categoria
              visualmente.
            </p>
          </div>

          <span
            className="
              hidden shrink-0 rounded-full
              bg-[#f4efe6] px-2.5 py-1
              text-[9px] font-bold uppercase
              tracking-wide text-[#8c5338]
              sm:inline-flex
            "
          >
            Opcional
          </span>
        </div>

        <div
          className={`
            relative overflow-hidden rounded-2xl
            border border-[#e6dec5]
            bg-[#fdfbf7]
            transition-all duration-200
            ${
              uploading
                ? 'border-[#c5a059] bg-[#f4efe6]'
                : 'hover:border-[#c5a059]/70'
            }
          `}
        >
          <input
            id="category-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={isBusy}
            className="
              absolute inset-0 z-10
              h-full w-full cursor-pointer
              opacity-0
              disabled:cursor-not-allowed
            "
            aria-label="Selecionar imagem da categoria"
          />

          {uploading ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center p-6">
              <div
                className="
                  flex h-12 w-12 items-center
                  justify-center rounded-2xl
                  border border-[#c5a059]/30
                  bg-white text-[#5c3524]
                  shadow-sm
                "
              >
                <Loader2
                  className="h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-[#5c3524]">
                A carregar imagem...
              </p>

              <p className="mt-1 text-[10px] text-[#8c5338]">
                Aguarde um momento
              </p>
            </div>
          ) : imageUrl ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center p-5">
              <div className="relative z-20">
                <div
                  className="
                    overflow-hidden rounded-2xl
                    border border-[#e6dec5]
                    bg-white p-1 shadow-sm
                  "
                >
                  <img
                    src={imageUrl}
                    alt={`Pré-visualização de ${
                      name || 'categoria'
                    }`}
                    className="
                      h-28 w-28 rounded-xl
                      object-cover
                      sm:h-32 sm:w-32
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isBusy}
                  className="
                    absolute -right-2 -top-2
                    flex h-7 w-7 cursor-pointer
                    items-center justify-center
                    rounded-full border-2 border-white
                    bg-red-600 text-white shadow-md
                    transition-all duration-200
                    hover:scale-105 hover:bg-red-700
                    focus:outline-none
                    focus:ring-2 focus:ring-red-300
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  aria-label="Remover imagem"
                  title="Remover imagem"
                >
                  <X
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs font-bold text-[#5c3524]">
                  Imagem adicionada
                </p>

                <p className="mt-1 text-[10px] text-[#8c5338]">
                  Clique para escolher outra imagem
                </p>
              </div>

              <div
                className="
                  mt-3 flex items-center gap-1.5
                  text-[9px] font-medium
                  text-[#8c5338]
                "
              >
                <Check
                  className="h-3 w-3 text-emerald-600"
                  aria-hidden="true"
                />

                JPG, PNG ou WEBP · Máx. 5 MB
              </div>
            </div>
          ) : (
            <div className="flex min-h-[190px] flex-col items-center justify-center p-6 text-center">
              <div
                className="
                  flex h-12 w-12 items-center
                  justify-center rounded-2xl
                  border border-[#e6dec5]
                  bg-[#f4efe6]
                  text-[#5c3524]
                  shadow-sm
                  transition-transform duration-200
                  group-hover:scale-105
                "
              >
                <ImagePlus
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-[#5c3524]">
                Adicionar imagem
              </p>

              <p className="mt-1 max-w-xs text-[10px] leading-5 text-[#8c5338]">
                Clique ou arraste uma imagem para esta
                área.
              </p>

              <span
                className="
                  mt-3 rounded-full
                  border border-[#e6dec5]
                  bg-white px-3 py-1.5
                  text-[9px] font-bold
                  text-[#8c5338]
                "
              >
                JPG · PNG · WEBP · até 5 MB
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="category-name"
            className="
              text-xs font-bold text-[#2b1810]
            "
          >
            Nome da categoria
          </label>

          <span className="text-[10px] font-medium text-[#8c5338]">
            {name.length}/80
          </span>
        </div>

        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Ex: Bolos Festivos"
          maxLength={80}
          disabled={isBusy}
          autoComplete="off"
          className="
            w-full rounded-xl
            border border-[#e6dec5]
            bg-[#fdfbf7]
            px-3.5 py-3
            text-sm text-[#2b1810]
            outline-none
            transition-all duration-200
            placeholder:text-[#a88978]
            hover:border-[#c5a059]/60
            focus:border-[#c5a059]
            focus:bg-white
            focus:ring-2
            focus:ring-[#c5a059]/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="category-description"
            className="
              text-xs font-bold text-[#2b1810]
            "
          >
            Descrição
          </label>

          <span className="text-[10px] font-medium text-[#8c5338]">
            {description.length}/300
          </span>
        </div>

        <textarea
          id="category-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Breve descrição da categoria..."
          rows={4}
          maxLength={300}
          disabled={isBusy}
          className="
            w-full resize-none rounded-xl
            border border-[#e6dec5]
            bg-[#fdfbf7]
            px-3.5 py-3
            text-sm leading-6 text-[#2b1810]
            outline-none
            transition-all duration-200
            placeholder:text-[#a88978]
            hover:border-[#c5a059]/60
            focus:border-[#c5a059]
            focus:bg-white
            focus:ring-2
            focus:ring-[#c5a059]/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <div
        className="
          flex flex-col-reverse gap-2
          border-t border-[#f4efe6]
          pt-5
          sm:flex-row sm:items-center
          sm:justify-end sm:gap-3
        "
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="
            flex w-full cursor-pointer
            items-center justify-center
            rounded-xl
            border border-[#e6dec5]
            bg-[#f4efe6]
            px-4 py-2.5
            text-xs font-bold text-[#5c3524]
            transition-all duration-200
            hover:border-[#d8c9aa]
            hover:bg-[#e6dec5]
            focus:outline-none
            focus:ring-2
            focus:ring-[#c5a059]/40
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isBusy}
          className="
            flex w-full min-w-[150px]
            cursor-pointer items-center
            justify-center gap-2
            rounded-xl
            border border-[#c5a059]/30
            bg-[#2b1810]
            px-5 py-2.5
            text-xs font-bold text-[#c5a059]
            shadow-sm
            transition-all duration-200
            hover:bg-[#5c3524]
            hover:shadow-md
            focus:outline-none
            focus:ring-2
            focus:ring-[#c5a059]/50
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          {saving ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />

              <span>A guardar...</span>
            </>
          ) : (
            <>
              <Check
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              <span>
                {isEditing
                  ? 'Guardar alterações'
                  : 'Criar categoria'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}