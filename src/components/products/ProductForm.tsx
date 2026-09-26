import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
} from 'react';

import {
  AlertCircle,
  Check,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';

import type { Product } from '../../types/product';

import type {
  ProductCategory,
  ProductFormData,
} from './ProductModal';

interface ProductFormProps {
  initialData?: Product | null;
  categories: ProductCategory[];
  onSave: (
    data: ProductFormData
  ) => void | Promise<void>;
  onCancel: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function ProductForm({
  initialData,
  categories,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(initialData);
  const isBusy = uploading || saving;

  useEffect(() => {
    setErrorMessage('');

    if (initialData) {
      setName(initialData.name ?? '');
      setCategoryId(initialData.categoryId ?? '');
      setDescription(initialData.description ?? '');

      setPrice(
        initialData.price !== undefined &&
          initialData.price !== null
          ? String(initialData.price)
          : ''
      );

      setAvailable(initialData.available ?? true);
      setImageUrl(initialData.imageUrl ?? '');

      return;
    }

    setName('');
    setDescription('');
    setPrice('');
    setAvailable(true);
    setImageUrl('');
    setCategoryId(categories[0]?.id ?? '');
  }, [initialData, categories]);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage('');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage(
        'Formato inválido. Usa uma imagem JPG, PNG ou WebP.'
      );

      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage(
        'A imagem é demasiado grande. O tamanho máximo é 5 MB.'
      );

      event.target.value = '';
      return;
    }

    try {
      setUploading(true);

      const fileExtension =
        file.name.split('.').pop()?.toLowerCase() || 'jpg';

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

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
          'Não foi possível obter o endereço da imagem.'
        );
      }

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error(
        'Erro ao fazer upload da imagem:',
        error
      );

      setErrorMessage(
        'Não foi possível carregar a imagem. Tenta novamente.'
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

  const handleImageError = (
    event: SyntheticEvent<HTMLImageElement>
  ) => {
    if (event.currentTarget.src === DEFAULT_PRODUCT_IMAGE) {
      return;
    }

    event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const numericPrice = Number(price);

    if (!trimmedName) {
      setErrorMessage(
        'O nome do produto é obrigatório.'
      );
      return;
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setErrorMessage(
        'Introduz um preço válido para o produto.'
      );
      return;
    }

    if (!categoryId) {
      setErrorMessage(
        'Seleciona uma categoria para o produto.'
      );
      return;
    }

    try {
      setSaving(true);

      await onSave({
        name: trimmedName,
        categoryId,
        description: trimmedDescription,
        price: numericPrice,
        available,
        imageUrl:
          imageUrl.trim() || DEFAULT_PRODUCT_IMAGE,
      });
    } catch (error) {
      console.error(
        'Erro ao guardar produto:',
        error
      );

      setErrorMessage(
        'Não foi possível guardar o produto. Tenta novamente.'
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
      {/* Erro */}
      {errorMessage && (
        <div
          role="alert"
          className="
            flex items-start gap-3
            rounded-xl border border-red-200
            bg-red-50 px-4 py-3
            text-xs font-medium text-red-700
          "
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />

          <span>{errorMessage}</span>
        </div>
      )}

      {/* Imagem */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-[#2b1810]">
            Imagem do produto
          </h3>

          <p className="mt-1 text-[11px] text-[#8c5338]">
            Escolha uma imagem para apresentar o produto
            na vitrine.
          </p>
        </div>

        {imageUrl ? (
          <div
            className="
              group relative h-48 overflow-hidden
              rounded-2xl border border-[#e6dec5]
              bg-[#f4efe6]
            "
          >
            <img
              src={imageUrl}
              alt={`Pré-visualização de ${name || 'produto'}`}
              onError={handleImageError}
              className="
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.02]
              "
            />

            <div
              className="
                absolute inset-x-0 bottom-0
                flex items-end justify-between
                bg-gradient-to-t from-black/60
                to-transparent p-4 pt-10
              "
            >
              <div className="flex items-center gap-2 text-white">
                <ImagePlus
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span className="text-[11px] font-semibold">
                  Imagem selecionada
                </span>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isBusy}
                title="Remover imagem"
                aria-label="Remover imagem"
                className="
                  flex h-8 w-8 cursor-pointer
                  items-center justify-center
                  rounded-lg bg-black/60
                  text-white transition-colors
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        ) : (
          <label
            className={`
              flex min-h-44 cursor-pointer
              flex-col items-center justify-center
              rounded-2xl border-2 border-dashed
              border-[#e6dec5]
              bg-[#fdfbf7] p-6 text-center
              transition-all
              ${
                uploading
                  ? 'cursor-wait opacity-70'
                  : 'hover:border-[#c5a059]/60 hover:bg-[#f4efe6]/50'
              }
            `}
          >
            <div
              className="
                mb-3 flex h-12 w-12
                items-center justify-center
                rounded-2xl border border-[#e6dec5]
                bg-[#f4efe6] text-[#8c5338]
              "
            >
              {uploading ? (
                <Loader2
                  className="h-6 w-6 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Upload
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              )}
            </div>

            <span className="text-xs font-bold text-[#2b1810]">
              {uploading
                ? 'A carregar imagem...'
                : 'Clique para carregar uma imagem'}
            </span>

            <span className="mt-1 text-[10px] text-[#8c5338]">
              JPG, PNG ou WebP · Máximo 5 MB
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={isBusy}
              className="hidden"
            />
          </label>
        )}
      </section>

      {/* Informações básicas */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#2b1810]">
            Informações básicas
          </h3>

          <p className="mt-1 text-[11px] text-[#8c5338]">
            Defina os dados principais do produto.
          </p>
        </div>

        {/* Nome */}
        <div className="space-y-1.5">
          <label
            htmlFor="product-name"
            className="text-xs font-bold text-[#2b1810]"
          >
            Nome
          </label>

          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Ex: Bolo de Chocolate Supremo"
            autoComplete="off"
            disabled={isBusy}
            className="
              w-full rounded-xl
              border border-[#e6dec5]
              bg-[#fdfbf7] px-3.5 py-2.5
              text-xs text-[#2b1810]
              outline-none transition-all
              placeholder:text-[#9a806f]
              focus:border-[#c5a059]
              focus:ring-2 focus:ring-[#c5a059]/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            required
          />
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <label
            htmlFor="product-category"
            className="text-xs font-bold text-[#2b1810]"
          >
            Categoria
          </label>

          <select
            id="product-category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            disabled={
              isBusy || categories.length === 0
            }
            className="
              w-full cursor-pointer rounded-xl
              border border-[#e6dec5]
              bg-[#fdfbf7] px-3.5 py-2.5
              text-xs text-[#2b1810]
              outline-none transition-all
              focus:border-[#c5a059]
              focus:ring-2 focus:ring-[#c5a059]/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            required
          >
            <option value="" disabled>
              {categories.length === 0
                ? 'Nenhuma categoria disponível'
                : 'Selecione uma categoria'}
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="product-description"
              className="text-xs font-bold text-[#2b1810]"
            >
              Descrição
            </label>

            <span className="text-[10px] text-[#8c5338]">
              {description.length}/500
            </span>
          </div>

          <textarea
            id="product-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Detalhes sobre os ingredientes e sabor..."
            rows={4}
            maxLength={500}
            disabled={isBusy}
            className="
              w-full resize-none rounded-xl
              border border-[#e6dec5]
              bg-[#fdfbf7] px-3.5 py-2.5
              text-xs leading-relaxed
              text-[#2b1810]
              outline-none transition-all
              placeholder:text-[#9a806f]
              focus:border-[#c5a059]
              focus:ring-2 focus:ring-[#c5a059]/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Preço */}
        <div className="space-y-1.5">
          <label
            htmlFor="product-price"
            className="text-xs font-bold text-[#2b1810]"
          >
            Preço
          </label>

          <div className="relative">
            <input
              id="product-price"
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              placeholder="0"
              disabled={isBusy}
              className="
                w-full rounded-xl
                border border-[#e6dec5]
                bg-[#fdfbf7]
                px-3.5 py-2.5 pr-12
                text-xs font-semibold
                text-[#2b1810]
                outline-none transition-all
                placeholder:text-[#9a806f]
                focus:border-[#c5a059]
                focus:ring-2 focus:ring-[#c5a059]/10
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              required
            />

            <span
              className="
                pointer-events-none absolute
                right-3.5 top-1/2
                -translate-y-1/2
                text-[10px] font-bold
                text-[#8c5338]
              "
            >
              Kz
            </span>
          </div>
        </div>
      </section>

      {/* Disponibilidade */}
      <section
        className="
          rounded-2xl border border-[#e6dec5]
          bg-[#fdfbf7] p-4
        "
      >
        <label
          className={`
            flex items-center justify-between gap-4
            ${
              isBusy
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                ${
                  available
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-stone-100 text-stone-500'
                }
              `}
            >
              <Check
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-xs font-bold text-[#2b1810]">
                Disponível para venda
              </p>

              <p className="mt-0.5 text-[10px] text-[#8c5338]">
                {available
                  ? 'O produto aparece como disponível na vitrine.'
                  : 'O produto ficará indisponível para venda.'}
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={available}
            onChange={(event) =>
              setAvailable(event.target.checked)
            }
            disabled={isBusy}
            className="
              h-4 w-4 cursor-pointer
              rounded accent-[#c5a059]
              disabled:cursor-not-allowed
            "
          />
        </label>
      </section>

      {/* Ações */}
      <div
        className="
          flex flex-col-reverse gap-2
          border-t border-[#f4efe6]
          pt-4
          sm:flex-row sm:items-center
          sm:justify-end sm:gap-3
        "
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="
            w-full cursor-pointer
            rounded-xl bg-[#f4efe6]
            px-4 py-2.5
            text-xs font-bold text-[#5c3524]
            transition-all
            hover:bg-[#e6dec5]
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
            flex w-full min-w-[130px]
            cursor-pointer items-center
            justify-center gap-2
            rounded-xl
            border border-[#c5a059]/30
            bg-[#2b1810]
            px-5 py-2.5
            text-xs font-bold text-[#c5a059]
            shadow-sm transition-all
            hover:bg-[#5c3524]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          "
        >
          {saving && (
            <Loader2
              className="h-3.5 w-3.5 animate-spin"
              aria-hidden="true"
            />
          )}

          <span>
            {saving
              ? 'A guardar...'
              : isEditing
                ? 'Guardar alterações'
                : 'Adicionar produto'}
          </span>
        </button>
      </div>
    </form>
  );
}
