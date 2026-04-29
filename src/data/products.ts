export interface Product {
  id: string;
  nameZh: string;
  nameEn: string;
  description: string;
  image: string;
  specs: {
    material: string;
    thickness: string;
    usage: string;
  };
  features: string[];
}

export const productsData: Record<string, Product> = {
  "1": {
    id: "1",
    nameZh: "纳帕牛皮革",
    nameEn: "Nappa Cowhide Leather",
    description:
      "采用顶级头层牛皮，经过精细鞣制工艺处理，质地柔软细腻，手感温润。表面呈现自然纹理，透气性能优异，是高端皮具制作的理想选材。",
    image: "/images/leather-1.jpg",
    specs: {
      material: "头层牛皮",
      thickness: "1.2 - 1.4mm",
      usage: "高端手袋、皮夹、鞋履",
    },
    features: ["质地柔软", "纹理自然", "透气耐磨", "色泽持久"],
  },
  "2": {
    id: "2",
    nameZh: "疯马皮革",
    nameEn: "Crazy Horse Leather",
    description:
      "独特的油蜡处理工艺，呈现出复古粗犷的质感。随着使用时间增长，表面会产生独特的色泽变化，越用越有味道，深受复古风格爱好者青睐。",
    image: "/images/leather-2.jpg",
    specs: {
      material: "头层牛皮",
      thickness: "1.6 - 2.0mm",
      usage: "复古包袋、工装靴、皮带",
    },
    features: ["复古质感", "变色效果", "耐磨耐刮", "个性独特"],
  },
  "3": {
    id: "3",
    nameZh: "植鞣皮革",
    nameEn: "Vegetable Tanned Leather",
    description:
      "采用天然植物鞣剂精制而成，环保无害，可塑性强。适合雕刻、染色等手工工艺，是手工皮具爱好者的首选材料，可养出独特的包浆效果。",
    image: "/images/leather-3.jpg",
    specs: {
      material: "优质牛皮",
      thickness: "1.8 - 2.2mm",
      usage: "手工皮具、雕刻作品、表带",
    },
    features: ["环保植鞣", "可塑性强", "易于雕刻", "养色效果佳"],
  },
  "4": {
    id: "4",
    nameZh: "漆皮皮革",
    nameEn: "Patent Leather",
    description:
      "表面经过高光涂层处理，呈现镜面般的光泽效果。防水防污性能优异，易于清洁打理，常用于制作正式场合使用的鞋履和包袋。",
    image: "/images/leather-4.jpg",
    specs: {
      material: "优质牛皮",
      thickness: "0.8 - 1.2mm",
      usage: "正装鞋履、晚宴包、时尚配饰",
    },
    features: ["镜面光泽", "防水防污", "易于打理", "时尚亮眼"],
  },
};

export const productsList = Object.values(productsData);
