import { meta } from '/src/utils/config';
import {
  themeConfig,
  appsPerPageConfig,
  navScaleConfig,
  searchConfig,
  prConfig,
  designConfig,
} from '/src/utils/config';

// Language configuration
export const languageConfig = [
 { option: 'Español', value: { language: 'es' } },
 { option: 'English', value: { language: 'en' } },
];

export const layoutConfig = [
  { option: 'Clásico', value: { layoutMode: 'classic' } },
  { option: 'Inicio - Classroom', value: { layoutMode: 'classroom' } },
  { option: 'Documentos', value: { layoutMode: 'docs' } },
  { option: 'Unidad', value: { layoutMode: 'drive' } },
  { option: 'Enfoque', value: { layoutMode: 'focus' } },
];

export const privacyConfig = ({ options, updateOption, openPanic }) => ({
  1: {
    name: 'Título del sitio',
    desc: 'Cambia el título y el icono de la pestaña del sitio.',
    config: meta,
    value: (
      meta.find(
        (c) => c.value && typeof c.value === 'object' && c.value.tabName === options.tabName,
      ) || meta[0]
    ).value,
    type: 'select',
    action: (a) => {
      updateOption(a);
      import('/src/utils/utils.js').then(({ ckOff }) => ckOff());
    },
  },
  2: {
    name: 'Ocultación automática',
    desc: 'Aplica automáticamente la ocultación al cambiar de pestaña y la restaura al volver.',
    config: meta,
    value: !!options.clkOff,
    type: 'switch',
    action: (b) => {
      setTimeout(() => {
        updateOption({ clkOff: b });
        import('/src/utils/utils.js').then(({ ckOff }) => ckOff());
      }, 100);
    },
    disabled: !options.tabName || options.tabName == meta[0].value.tabName,
  },
  3: {
    name: 'Abrir about:blank al iniciar',
    desc: 'Cuando se activa, la pestaña about:blank se abre automáticamente al entrar.',
    value:
      options.aboutBlankAutoOpen === true ||
      (options.aboutBlank && options.aboutBlankAutoOpen !== false),
    type: 'switch',
    action: (b) => setTimeout(() => updateOption({ aboutBlankAutoOpen: b }), 100),
  },
  4: {
    name: 'Tecla de emergencia',
    desc: 'Activa o desactiva la tecla de emergencia.',
    value: !!options.panicToggleEnabled,
    type: 'switch',
    action: (b) => {
      setTimeout(() => {
        updateOption({ panicToggleEnabled: b });
        import('/src/utils/utils.js').then(({ panic }) => panic());
      }, 100);
    },
  },
  5: {
    name: 'Atajo de emergencia',
    desc: 'Configura una tecla que redirige a otra página al pulsarla.',
    value: 'Set Key',
    type: 'button',
    action: openPanic,
    disabled: !!!options.panicToggleEnabled,
  },
});

export const customizeConfig = ({ options, updateOption }) => ({
  1: {
    name: 'Idioma',
    desc: 'Selecciona el idioma de la página.',
    config: languageConfig,
    value: find(languageConfig, (c) => c.value?.language === (options.language ?? 'es'), 0),
    type: 'select',
    action: (a) => {
      updateOption(a);
      location.reload();
    },
  },
  2: {
    name: 'Diseño de página',
    desc: 'Elige una presentación: clásica, aula, documentos, unidad o enfoque.',
    config: layoutConfig,
    value: find(layoutConfig, (c) => c.value?.layoutMode === (options.layoutMode ?? 'classic'), 0),
    type: 'select',
    action: (a) => updateOption(a),
  },
  3: {
    name: 'Tema del sitio',
    desc: 'Personaliza la apariencia del sitio seleccionando un tema.',
    config: themeConfig,
    value: find(themeConfig, (c) => c.value?.themeName === options.themeName, 0),
    type: 'select',
    action: (a) => updateOption(a),
  },
  4: {
    name: 'Diseño de fondo',
    desc: 'Personaliza el diseño de fondo del sitio.',
    config: designConfig,
    value: find(designConfig, (c) => c.value?.bgDesign === options.bgDesign, 0),
    type: 'select',
    action: (a) => updateOption(a),
  },
  5: {
    name: 'Aplicaciones por página',
    desc: 'Número de aplicaciones que se muestran por página.',
    config: appsPerPageConfig,
    value: find(appsPerPageConfig, (c) => c.value.itemsPerPage === (options.itemsPerPage ?? 20), 2),
    type: 'select',
    action: (a) => updateOption(a),
  },
  6: {
    name: 'Escala del menú',
    desc: 'Ajusta el tamaño del menú superior y su logotipo.',
    config: navScaleConfig,
    value: find(navScaleConfig, (c) => c.value.navScale === (options.navScale ?? 1), 3),
    type: 'select',
    action: (a) => updateOption(a),
  },
  7: {
    name: 'Barra de pestañas',
    desc: 'Muestra una barra para cambiar rápidamente entre tus páginas.',
    value: options.showTb ?? true,
    type: 'switch',
    action: (b) => setTimeout(() => updateOption({ showTb: b }), 100),
  },
  8: {
    name: 'Botón de donación',
    desc: 'Muestra u oculta el botón de apoyo.',
    value: options.donationBtn ?? true,
    type: 'switch',
    action: (b) => setTimeout(() => updateOption({ donationBtn: b }), 100),
  },
});

export const browsingConfig = ({ options, updateOption }) => ({
  1: {
    name: 'Motor de búsqueda',
    desc: 'Elige el motor de búsqueda predeterminado para las consultas.',
    config: searchConfig,
    value: find(searchConfig, (c) => c.value?.engine === options.engine, 0),
    type: 'select',
    action: (a) => updateOption(a),
  },
  2: {
    name: 'Motor de navegación',
    desc: 'Elige el motor predeterminado para navegar.',
    config: prConfig,
    value: find(prConfig, (c) => c.value?.prType === options.prType, 0),
    type: 'select',
    action: (a) => updateOption(a),
  },
});

export const advancedConfig = ({ options, updateOption }) => ({
  1: {
    name: 'Confirmar salida',
    desc: 'Muestra una confirmación al intentar salir del sitio.',
    value: !!options.beforeUnload,
    type: 'switch',
    action: (b) => {
      setTimeout(() => updateOption({ beforeUnload: b }));
      location.reload();
    },
  },
  2: {
    name: 'Configuración de Wisp',
    desc: 'Configura la ubicación del servidor WebSocket.',
    value: options.wServer
      ? options.wServer
      : !isStaticBuild
        ? `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/wisp/`
        : '',
    type: 'input',
    action: (b) => updateOption({ wServer: b || null }),
  },
  3: {
    name: 'Restablecer sitio',
    desc: 'Borra los datos del sitio si tienes problemas.',
    type: 'button',
    value: 'Reset Data',
    action: () => import('/src/utils/utils.js').then(({ resetInstance }) => resetInstance()),
  },
});

function find(config, predicate, fallbackIndex = 0) {
  const found = config.find(predicate);
  return found ? found.value : config[fallbackIndex].value; // fallback
}
