import { create } from "zustand";
import { PageData, SectionNode, ComponentNode, ComponentType, ResponsiveLayout, GlobalBlock } from "../types/builder";

interface SelectedElement {
  type: "section" | "component" | "globalHeader" | "globalFooter";
  sectionId?: string;
  elementId?: string;
  subElementKey?: string;
}

interface BuilderStore {
  past: PageData[];
  present: PageData;
  future: PageData[];
  selectedElement: SelectedElement | null;
  activeDevice: "desktop" | "tablet" | "mobile";
  isSaved: boolean;
  zoom: number;
  globalHeader: ComponentNode | null;
  globalFooter: ComponentNode | null;
  primaryColor: string;
  secondaryColor: string;
  gradientStart: string;
  gradientEnd: string;
  logoImg: string;
  logoText: string;
  sectionGap: string;
  leftSidebarCollapsed: boolean;
  activeDrawer: "add" | "pages" | "layers" | "components" | null;
  hoveredElementId: string | null;

  // Global Reusable Blocks State & Actions
  globalBlocks: GlobalBlock[];
  saveSectionAsGlobalBlock: (sectionId: string, name: string) => void;
  insertGlobalBlockSection: (globalBlockId: string) => void;
  unlinkGlobalBlockSection: (sectionId: string) => void;
  deleteGlobalBlock: (globalBlockId: string) => void;

  // Actions
  undo: () => void;
  redo: () => void;
  loadPage: (page: PageData) => void;
  setSelectedElement: (selected: SelectedElement | null) => void;
  setHoveredElementId: (id: string | null) => void;
  setActiveDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setSaved: (saved: boolean) => void;
  setZoom: (zoom: number) => void;
  setSectionGap: (gap: string) => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  setActiveDrawer: (drawer: "add" | "pages" | "layers" | "components" | null) => void;

  // Section Mutations
  addSection: (layout?: Partial<ResponsiveLayout>) => void;
  removeSection: (sectionId: string) => void;
  updateSectionLayout: (sectionId: string, layoutUpdate: Partial<ResponsiveLayout>) => void;
  updateSectionStyle: (sectionId: string, styleUpdate: Record<string, any>) => void;
  duplicateSection: (sectionId: string) => void;
  duplicateComponent: (sectionId: string, componentId: string) => void;
  addSectionTemplate: (templateType: string) => void;
  reorderSections: (activeId: string, overId: string) => void;

  // Component Mutations
  addComponentToSection: (sectionId: string, componentType: ComponentType, index?: number) => void;
  removeComponent: (sectionId: string, componentId: string) => void;
  updateComponentProps: (sectionId: string, componentId: string, props: Record<string, any>) => void;
  reorderComponents: (sectionId: string, activeId: string, overId: string) => void;
  toggleShowHeader: () => void;
  toggleShowFooter: () => void;
  updateGlobalHeaderProps: (props: Record<string, any>) => void;
  updateGlobalFooterProps: (props: Record<string, any>) => void;
}

const DEFAULT_PAGE: PageData = {
  name: "Untitled Page",
  slug: "untitled",
  showHeader: true,
  showFooter: true,
  sections: [
    {
      id: "section-welcome",
      layout: {
        desktop: "1-col",
        tablet: "1-col",
        mobile: "1-col",
      },
      children: [
        {
          id: "comp-welcome-hero",
          type: "hero",
          props: {
            heading: "Section + Grid Website Builder",
            subheading: "Design responsive grid-based pages visually. Switch between breakpoints, drag components, and publish instantly.",
            buttonText: "Get Started",
            buttonUrl: "#",
            bgGradient: "from-blue-600 via-blue-700 to-indigo-900",
            textColor: "#ffffff",
            align: "center",
            marginTop: "mt-0",
            marginBottom: "mb-0",
          },
        },
      ],
    },
  ],
};

const getDefaultProps = (type: ComponentType): Record<string, any> => {
  switch (type) {
    case "navbar":
      return {
        logoText: "skilldeck",
        showLogo: true,
        logoImg: "",
        logoUrl: "/",
        useGlobalLogo: true,
        useGlobalLogoImg: true,
        useGlobalLogoText: true,
        showLogoText: true,
        showCategories: true,
        categoriesText: "All Categories",
        categoriesDropdownWidth: "800px",
        categoriesDropdownHeight: "450px",
        showCategoryIcon: true,
        showCategoryDesc: true,
        showCategoryExplore: true,
        showCourseDetails: true,
        showCourseBadge: true,

        showSearch: true,
        searchPlaceholder: "What you want to learn today?",
        links: [
          {
            type: "dropdown",
            label: "Resources",
            items: [
              { type: "header", label: "Learning Materials" },
              { type: "link", label: "Tutorials Hub", url: "#" },
              { type: "link", label: "Developer Blog", url: "#" },
              { type: "divider" },
              { type: "header", label: "Support & Help" },
              { type: "button", label: "Submit Ticket", url: "#", variant: "outline" }
            ]
          },
          { type: "link", label: "Enterprise", url: "#" },
          {
            type: "dropdown",
            label: "Contact Us",
            items: [
              { type: "link", label: "Support Desk", url: "#" },
              { type: "link", label: "Sales Inquiry", url: "#" }
            ]
          }
        ],
        ctaText: "Login / Signup",
        ctaUrl: "#",
        bgStyle: "gradient",
        bgColor: "#ffffff",
        bgGradient: "from-white to-white",
        textColor: "#0f172a",
        ctaColor: "#0f172a",
        contentMaxWidth: "6xl",
        searchWidth: "320px",
        marginTop: "mt-4",
        marginBottom: "mb-0",
        navbarWidth: "floating",
        itemsGap: "gap-4",
      };
    case "footer":
      return {
        copyrightText: "© 2026 SkillDeck. All rights reserved.",
        brandName: "SkillDeck",
        brandDescription: "Empowering students with cutting-edge academic learning resources and infrastructure tools.",
        useGlobalLogo: true,
        logoImg: "",
        useGlobalLogoImg: true,
        useGlobalLogoText: true,
        showLogoText: true,
        showBrandColumn: true,
        socialFacebook: "",
        socialTwitter: "",
        socialInstagram: "",
        socialLinkedin: "",
        socialYoutube: "",
        columnsPerRow: "auto",
        columns: [
          {
            type: "links",
            title: "Product",
            links: [{ label: "Features", url: "#" }, { label: "Pricing", url: "#" }]
          },
          {
            type: "links",
            title: "Company",
            links: [{ label: "About", url: "#" }, { label: "Careers", url: "#" }]
          }
        ],
        bgStyle: "gradient",
        bgColor: "#0f172a",
        bgGradient: "from-slate-900 to-slate-950",
        textColor: "#ffffff",
        marginTop: "mt-8",
        marginBottom: "mb-0",
        footerWidth: "floating",
        contentMaxWidth: "6xl",
        showPrivacyPolicy: true,
        privacyPolicyLabel: "Privacy Policy",
        privacyPolicyUrl: "#",
        showTermsOfService: true,
        termsOfServiceLabel: "Terms of Service",
        termsOfServiceUrl: "#",
      };
    case "heading":
      return {
        text: "Double-click to edit heading",
        level: "h2",
        align: "left",
        color: "#0f172a",
        fontSize: "text-3xl",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
    case "text":
      return {
        text: "This is a paragraph. Double-click to type your custom content. You can configure colors, fonts, alignment, and spacing directly in the editor.",
        align: "left",
        color: "#475569",
        fontSize: "text-base",
        marginTop: "mt-2",
        marginBottom: "mb-4",
      };
    case "image":
      return {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
        alt: "Placeholder Image",
        borderRadius: "rounded-lg",
        aspectRatio: "aspect-video",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
    case "button":
      return {
        text: "Click Here",
        url: "#",
        variant: "primary",
        color: "#2563eb",
        textColor: "#ffffff",
        size: "md",
        borderRadius: "rounded-md",
        align: "left",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
    case "video":
      return {
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        aspectRatio: "aspect-video",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
    case "hero":
      return {
        heading: "A Beautiful Hero Title",
        subheading: "An engaging subtitle to hook your website visitors and explain your product value proposition.",
        buttonText: "Discover More",
        buttonUrl: "#",
        bgType: "gradient",
        gradientStart: "#3b82f6",
        gradientEnd: "#1e3a8a",
        textColor: "#ffffff",
        ctaBgColor: "#ffffff",
        ctaTextColor: "#2563eb",
        align: "left",
        borderRadius: "rounded-2xl",
        shadowSize: "shadow-xl",
        marginTop: "mt-0",
        marginBottom: "mb-0",
      };
    case "testimonial":
      return {
        quote: "This section + grid builder saved us days of development. It strikes the perfect balance between layout control and visual simplicity.",
        author: "Alex Rivers",
        role: "Lead Engineer",
        company: "VLSITech",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bgType: "color",
        bgColor: "#ffffff",
        textColor: "#334155",
        authorColor: "#0f172a",
        accentColor: "#2563eb",
        borderRadius: "rounded-xl",
        shadowSize: "shadow-sm",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
    case "faq":
      return {
        items: [
          {
            question: "How does the section layout system work?",
            answer: "A page is built of sections. Each section has a grid layout (e.g. 2-column or 70/30). Components inside are distributed sequentially across the columns.",
          },
          {
            question: "Can I customize layout per screen size?",
            answer: "Absolutely. Toggle the responsive preview at the top to set different column structures for mobile, tablet, and desktop.",
          },
        ],
        bgType: "color",
        bgColor: "#ffffff",
        textColor: "#1e293b",
        answerColor: "#475569",
        accentColor: "#2563eb",
        borderRadius: "rounded-xl",
        shadowSize: "shadow-sm",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
    case "courseCard":
      return {
        title: "Advanced VLSI Physical Design",
        instructor: "Prof. S. Nizamuddin",
        badge: "Best Seller",
        price: "$149.99",
        duration: "24 Hours",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        buttonText: "Enroll Now",
        bgType: "color",
        bgColor: "#ffffff",
        textColor: "#1e293b",
        detailsColor: "#64748b",
        accentColor: "#2563eb",
        url: "#",
        borderRadius: "rounded-xl",
        shadowSize: "shadow-md",
        marginTop: "mt-4",
        marginBottom: "mb-4",
      };
  }
};

const DEFAULT_HEADER: ComponentNode = {
  id: "global-header",
  type: "navbar",
  props: getDefaultProps("navbar"),
};

const DEFAULT_FOOTER: ComponentNode = {
  id: "global-footer",
  type: "footer",
  props: getDefaultProps("footer"),
};

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const useBuilderStore = create<BuilderStore>((set, get) => {
  const updatePresent = (updater: (present: PageData) => void) => {
    const { past, present } = get();
    const oldPresent = clone(present);
    const newPresent = clone(present);
    updater(newPresent);

    // Cap history at 50 records
    const newPast = [...past, oldPresent].slice(-50);

    set({
      past: newPast,
      present: newPresent,
      future: [],
      isSaved: false,
    });
  };

  return {
    past: [],
    present: DEFAULT_PAGE,
    future: [],
    selectedElement: null,
    activeDevice: "desktop",
    isSaved: true,
    zoom: 100,
    setZoom: (zoom) => set({ zoom }),
    setSectionGap: (gap) => set({ sectionGap: gap }),
    hoveredElementId: null,
    setHoveredElementId: (id) => set({ hoveredElementId: id }),
    leftSidebarCollapsed: false,
    setLeftSidebarCollapsed: (collapsed) => set({ leftSidebarCollapsed: collapsed }),
    activeDrawer: null,
    setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
    toggleShowHeader: () => {
      updatePresent((present) => {
        present.showHeader = present.showHeader === undefined ? false : !present.showHeader;
      });
    },
    toggleShowFooter: () => {
      updatePresent((present) => {
        present.showFooter = present.showFooter === undefined ? false : !present.showFooter;
      });
    },
    updateGlobalHeaderProps: (props) => {
      const { globalHeader } = get();
      if (!globalHeader) return;
      set({
        globalHeader: {
          ...globalHeader,
          props: { ...globalHeader.props, ...props }
        }
      });
      updatePresent((present) => {
        present.showHeader = true;
      });
    },
    updateGlobalFooterProps: (props) => {
      const { globalFooter } = get();
      if (!globalFooter) return;
      set({
        globalFooter: {
          ...globalFooter,
          props: { ...globalFooter.props, ...props }
        }
      });
      updatePresent((present) => {
        present.showFooter = true;
      });
    },
    globalHeader: DEFAULT_HEADER,
    globalFooter: DEFAULT_FOOTER,
    primaryColor: "#2563eb",
    secondaryColor: "#1e3a8a",
    gradientStart: "#3b82f6",
    gradientEnd: "#1e3a8a",
    logoImg: "",
    logoText: "SkillDeck",
    sectionGap: "8",
    globalBlocks: [],
    saveSectionAsGlobalBlock: (sectionId: string, name: string) => {
      const { present, globalBlocks } = get();
      const section = present.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const blockId = `block-${Date.now()}`;
      const clonedSection = clone(section);
      clonedSection.globalBlockId = blockId;

      const newBlock: GlobalBlock = {
        id: blockId,
        name: name || "Saved Reusable Block",
        section: clonedSection,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Link current section in present state to this global block
      updatePresent((p) => {
        const targetSec = p.sections.find((s) => s.id === sectionId);
        if (targetSec) targetSec.globalBlockId = blockId;
      });

      set({ globalBlocks: [...globalBlocks, newBlock] });
    },

    insertGlobalBlockSection: (globalBlockId: string) => {
      const { globalBlocks } = get();
      const masterBlock = globalBlocks.find((b) => b.id === globalBlockId);
      if (!masterBlock) return;

      updatePresent((present) => {
        const id = `section-${Date.now()}`;
        const newSec = clone(masterBlock.section);
        newSec.id = id;
        newSec.globalBlockId = globalBlockId;
        // regenerate inner component IDs
        newSec.children = newSec.children.map((c) => ({
          ...c,
          id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }));
        present.sections.push(newSec);
      });
    },

    unlinkGlobalBlockSection: (sectionId: string) => {
      updatePresent((present) => {
        const sec = present.sections.find((s) => s.id === sectionId);
        if (sec) delete sec.globalBlockId;
      });
    },

    deleteGlobalBlock: (globalBlockId: string) => {
      const { globalBlocks } = get();
      set({ globalBlocks: globalBlocks.filter((b) => b.id !== globalBlockId) });
    },

    undo: () => {
      const { past, present, future } = get();
      if (past.length === 0) return;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      const newFuture = [present, ...future];

      set({
        past: newPast,
        present: previous,
        future: newFuture,
        isSaved: false,
      });
    },

    redo: () => {
      const { past, present, future } = get();
      if (future.length === 0) return;

      const next = future[0];
      const newFuture = future.slice(1);
      const newPast = [...past, present];

      set({
        past: newPast,
        present: next,
        future: newFuture,
        isSaved: false,
      });
    },

    loadPage: (pageData) => {
      set({
        present: clone(pageData),
        past: [],
        future: [],
        selectedElement: null,
        isSaved: true,
      });
    },

    setSelectedElement: (selected) => {
      set({ selectedElement: selected });
    },

    setActiveDevice: (device) => {
      set({ activeDevice: device });
    },

    setSaved: (saved) => {
      set({ isSaved: saved });
    },

    // Section Mutations
    addSection: (layout) => {
      updatePresent((present) => {
        const id = `section-${Date.now()}`;
        present.sections.push({
          id,
          layout: {
            desktop: layout?.desktop || "1-col",
            tablet: layout?.tablet || "1-col",
            mobile: layout?.mobile || "1-col",
          },
          children: [],
        });
      });
    },

    removeSection: (sectionId) => {
      const { selectedElement } = get();
      updatePresent((present) => {
        present.sections = present.sections.filter((s) => s.id !== sectionId);
      });
      // Clear selection if deleted
      if (selectedElement?.sectionId === sectionId) {
        set({ selectedElement: null });
      }
    },

    updateSectionLayout: (sectionId, layoutUpdate) => {
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          section.layout = {
            ...section.layout,
            ...layoutUpdate,
          };
        }
      });
    },

    updateSectionStyle: (sectionId, styleUpdate) => {
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          section.style = {
            ...(section.style || {}),
            ...styleUpdate,
          };
        }
      });
    },

    duplicateSection: (sectionId) => {
      updatePresent((present) => {
        const sectionIdx = present.sections.findIndex((s) => s.id === sectionId);
        if (sectionIdx !== -1) {
          const original = present.sections[sectionIdx];
          const clonedSection = clone(original);
          clonedSection.id = `section-${Date.now()}`;
          // Generate new unique IDs for components to prevent duplicate keys in React loops
          clonedSection.children = clonedSection.children.map((c: any) => ({
            ...c,
            id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          }));
          present.sections.splice(sectionIdx + 1, 0, clonedSection);
        }
      });
    },

    duplicateComponent: (sectionId, componentId) => {
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          const compIdx = section.children.findIndex((c) => c.id === componentId);
          if (compIdx !== -1) {
            const original = section.children[compIdx];
            const clonedComp = clone(original);
            clonedComp.id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            section.children.splice(compIdx + 1, 0, clonedComp);
          }
        }
      });
    },

    addSectionTemplate: (templateType) => {
      updatePresent((present) => {
        const id = `section-${Date.now()}`;
        const newSection: SectionNode = {
          id,
          layout: {
            desktop: "1-col",
            tablet: "1-col",
            mobile: "1-col",
          },
          children: [],
        };

        const defaults = (type: ComponentType) => {
          const store = useBuilderStore.getState();
          const pc = store.primaryColor;
          const sc = store.secondaryColor;
          const gs = store.gradientStart;
          const ge = store.gradientEnd;
          const defs = getDefaultProps(type);
          const brandOverrides: Record<string, any> = {};
          if ("accentColor" in defs) brandOverrides.accentColor = pc;
          if ("ctaTextColor" in defs) brandOverrides.ctaTextColor = pc;
          if ("gradientEnd" in defs) brandOverrides.gradientEnd = ge;
          if (type === "button") brandOverrides.color = pc;
          if (type === "hero") {
            brandOverrides.gradientStart = gs;
            brandOverrides.gradientEnd = ge;
          }
          return { ...defs, ...brandOverrides };
        };

        const createComp = (type: ComponentType, propsUpdate: Record<string, any> = {}): ComponentNode => ({
          id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          props: { ...defaults(type), ...propsUpdate },
        });

        if (templateType === "Header") {
          newSection.layout.desktop = "1-col";
          newSection.children.push(createComp("navbar"));
        } else if (templateType === "Footer") {
          newSection.layout.desktop = "1-col";
          newSection.children.push(createComp("footer"));
        } else if (templateType === "Hero") {
          newSection.layout.desktop = "1-col";
          newSection.children.push(createComp("hero", {
            heading: "Create visually stunning digital experiences",
            subheading: "Launch faster with our drag-and-drop website builder. Craft clean grid layouts, select fonts, customize colors, and publish with a single click.",
            bgStyle: "preset-gradient",
            bgGradient: "from-blue-600 via-blue-750 to-indigo-900",
            buttonText: "Start Building Free",
            align: "center",
          }));
        } else if (templateType === "Bento") {
          newSection.layout.desktop = "3-col";
          newSection.layout.tablet = "2-col";
          newSection.children.push(
            createComp("hero", {
              heading: "Analytics Dashboard",
              subheading: "Real-time metrics at a glance.",
              buttonText: "",
              bgStyle: "solid",
              bgColor: "#f8fafc",
              textColor: "#0f172a",
              align: "left"
            }),
            createComp("image", {
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
              aspectRatio: "aspect-square"
            }),
            createComp("testimonial", {
              quote: "Our engagement grew by 40% after launching the new landing pages.",
              author: "Sarah Chen",
              role: "Head of Marketing",
              company: "MetricsCo",
              bgColor: "#eff6ff"
            })
          );
        } else if (templateType === "ArticleCard") {
          newSection.layout.desktop = "2-col";
          newSection.layout.tablet = "1-col";
          newSection.children.push(
            createComp("image", {
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
              aspectRatio: "aspect-video",
              borderRadius: "rounded-2xl"
            }),
            createComp("hero", {
              heading: "Crafting Premium Codebases",
              subheading: "A deep dive into clean architectures, modern styling conventions, and developer workflows designed for scale.",
              buttonText: "Read Article",
              bgStyle: "solid",
              bgColor: "#ffffff",
              textColor: "#1e293b",
              ctaBgColor: "#0f172a",
              ctaTextColor: "#ffffff",
              align: "left"
            })
          );
        } else if (templateType === "FeatureCards") {
          newSection.layout.desktop = "3-col";
          newSection.layout.tablet = "2-col";
          newSection.children.push(
            createComp("hero", {
              heading: "Lightning Fast",
              subheading: "Optimized for maximum speed and sub-second load times.",
              buttonText: "",
              bgStyle: "solid",
              bgColor: "#ffffff",
              textColor: "#0f172a",
              align: "center"
            }),
            createComp("hero", {
              heading: "Fully Responsive",
              subheading: "Beautiful styling designed to render flawlessly on mobile and desktop devices.",
              buttonText: "",
              bgStyle: "solid",
              bgColor: "#ffffff",
              textColor: "#0f172a",
              align: "center"
            }),
            createComp("hero", {
              heading: "Secure & Cloud-hosted",
              subheading: "State-of-the-art security keeps your client configurations safe.",
              buttonText: "",
              bgStyle: "solid",
              bgColor: "#ffffff",
              textColor: "#0f172a",
              align: "center"
            })
          );
        } else if (templateType === "CardGrid") {
          newSection.layout.desktop = "4-col";
          newSection.layout.tablet = "2-col";
          newSection.children.push(
            createComp("courseCard", { title: "Fullstack Next.js", price: "$49", duration: "12 Hours", badge: "Hot" }),
            createComp("courseCard", { title: "Tailwind UI Masterclass", price: "$29", duration: "6 Hours", badge: "New" }),
            createComp("courseCard", { title: "Zustand State Management", price: "$19", duration: "4 Hours", badge: "Trending" }),
            createComp("courseCard", { title: "Mongoose & Database Design", price: "$39", duration: "8 Hours", badge: "Pro" })
          );
        } else if (templateType === "Pricing") {
          newSection.layout.desktop = "3-col";
          newSection.layout.tablet = "2-col";
          newSection.children.push(
            createComp("hero", {
              heading: "Starter",
              subheading: "Free • Best for testing ideas.\n\n✓ 1 Project\n✓ Core Analytics\n✓ Shared Subdomain",
              buttonText: "Sign Up Free",
              bgStyle: "solid",
              bgColor: "#ffffff",
              textColor: "#0f172a",
              ctaBgColor: "#0f172a",
              ctaTextColor: "#ffffff",
              align: "center"
            }),
            createComp("hero", {
              heading: "Professional",
              subheading: "$29/mo • Best for growing teams.\n\n✓ 5 Projects\n✓ Premium Analytics\n✓ Custom Domains",
              buttonText: "Go Pro",
              bgStyle: "preset-gradient",
              bgGradient: "from-blue-600 via-blue-700 to-indigo-900",
              buttonUrl: "#",
              textColor: "#ffffff",
              ctaBgColor: "#ffffff",
              ctaTextColor: "#2563eb",
              align: "center"
            }),
            createComp("hero", {
              heading: "Enterprise",
              subheading: "$99/mo • Best for scaling business.\n\n✓ Unlimited Projects\n✓ 24/7 Priority Support\n✓ Custom SLAs",
              buttonText: "Contact Sales",
              bgStyle: "solid",
              bgColor: "#ffffff",
              textColor: "#0f172a",
              ctaBgColor: "#0f172a",
              ctaTextColor: "#ffffff",
              align: "center"
            })
          );
        } else if (templateType === "ContactUs") {
          newSection.layout.desktop = "2-col";
          newSection.layout.tablet = "1-col";
          newSection.children.push(
            createComp("hero", {
              heading: "Get In Touch",
              subheading: "Have questions about VLSI design training or corporate subscriptions? Our support desk is ready to help you.\n\n✉ support@skilldeck.net\n☎ +1 (555) 019-2834\n📍 San Francisco, CA",
              buttonText: "Schedule Call",
              bgStyle: "solid",
              bgColor: "#eff6ff",
              textColor: "#1e3a8a",
              ctaBgColor: "#1e3a8a",
              ctaTextColor: "#ffffff",
              align: "left"
            }),
            createComp("faq", {
              items: [
                { question: "When are active coaching sessions held?", answer: "Coaching sessions run live every Tuesday and Thursday at 10 AM PST." },
                { question: "Can I upgrade or downgrade anytime?", answer: "Yes, you can modify your team subscription settings directly inside your account billing page." }
              ]
            })
          );
        }

        present.sections.push(newSection);
      });
    },

    reorderSections: (activeId, overId) => {
      updatePresent((present) => {
        const activeIdx = present.sections.findIndex((s) => s.id === activeId);
        const overIdx = present.sections.findIndex((s) => s.id === overId);
        if (activeIdx !== -1 && overIdx !== -1) {
          const [moved] = present.sections.splice(activeIdx, 1);
          present.sections.splice(overIdx, 0, moved);
        }
      });
    },

    // Component Mutations
    addComponentToSection: (sectionId, componentType, index) => {
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          const defaults = getDefaultProps(componentType);
          const { primaryColor: pc, secondaryColor: sc, gradientStart: gs, gradientEnd: ge } = get();

          // Override accent-type defaults with user's branding colors
          const brandOverrides: Record<string, any> = {};
          if ("accentColor" in defaults) brandOverrides.accentColor = pc;
          if ("ctaTextColor" in defaults) brandOverrides.ctaTextColor = pc;
          if ("gradientEnd" in defaults) brandOverrides.gradientEnd = ge;
          if (componentType === "button") brandOverrides.color = pc;
          if (componentType === "hero") {
            brandOverrides.gradientStart = gs;
            brandOverrides.gradientEnd = ge;
          }

          const newComp: ComponentNode = {
            id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: componentType,
            props: { ...defaults, ...brandOverrides },
          };
          if (index !== undefined) {
            section.children.splice(index, 0, newComp);
          } else {
            section.children.push(newComp);
          }
        }
      });
    },

    removeComponent: (sectionId, componentId) => {
      const { selectedElement } = get();
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          section.children = section.children.filter((c) => c.id !== componentId);
        }
      });
      // Clear selection if deleted
      if (selectedElement?.elementId === componentId) {
        set({ selectedElement: null });
      }
    },

    updateComponentProps: (sectionId, componentId, propsUpdate) => {
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          const comp = section.children.find((c) => c.id === componentId);
          if (comp) {
            comp.props = {
              ...comp.props,
              ...propsUpdate,
            };
          }
        }
      });
    },

    reorderComponents: (sectionId, activeId, overId) => {
      updatePresent((present) => {
        const section = present.sections.find((s) => s.id === sectionId);
        if (section) {
          const activeIdx = section.children.findIndex((c) => c.id === activeId);
          const overIdx = section.children.findIndex((c) => c.id === overId);
          if (activeIdx !== -1 && overIdx !== -1) {
            const [moved] = section.children.splice(activeIdx, 1);
            section.children.splice(overIdx, 0, moved);
          }
        }
      });
    },
  };
});
