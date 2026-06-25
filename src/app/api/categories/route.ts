import { NextResponse } from "next/server";
import { fetchFromBackend, getResolvedConfig } from "@/lib/apiProxy";

type CategoryRecord = {
  _id?: string;
  slug?: string;
  order?: number;
  name?: string;
} & Record<string, unknown>;

type CourseCategoryReference = {
  _id?: string;
  slug?: string;
};

type CourseRecord = {
  category?: string | CourseCategoryReference | null;
  slug?: string;
  course_title?: string;
  course_name?: string;
  order?: number;
  courseCard?: any;
} & Record<string, unknown>;

interface CategoriesResponse {
  data?: CategoryRecord[];
}

interface CoursesResponse {
  data?: CourseRecord[];
}

const getSortOrder = (value?: number) => value ?? 0;

const toCategoryCourse = (course: CourseRecord) => {
  const slug = typeof course.slug === "string" ? course.slug : "";
  const courseTitle = typeof course.course_title === "string"
    ? course.course_title
    : typeof course.course_name === "string"
      ? course.course_name
      : "";

  if (!slug || !courseTitle) {
    return null;
  }

  const rawCourseCard = typeof course.courseCard === "object" && course.courseCard !== null
    ? course.courseCard
    : null;

  return {
    slug,
    course_title: courseTitle,
    course_name: typeof course.course_name === "string" ? course.course_name : undefined,
    order: typeof course.order === "number" ? course.order : undefined,
    courseCard: rawCourseCard ? {
      courseIcon: rawCourseCard.courseIcon,
      courseThumbnail: typeof rawCourseCard.courseThumbnail === "string" ? rawCourseCard.courseThumbnail : undefined,
      courseTag: typeof rawCourseCard.courseTag === "string" ? rawCourseCard.courseTag : undefined,
      courseType: typeof rawCourseCard.courseType === "string" ? rawCourseCard.courseType : undefined,
      courseMode: typeof rawCourseCard.courseMode === "string" ? rawCourseCard.courseMode : undefined,
      totalEnrolled: typeof rawCourseCard.totalEnrolled === "string" ? rawCourseCard.totalEnrolled : undefined,
      courseDuration: typeof rawCourseCard.courseDuration === "string" ? rawCourseCard.courseDuration : undefined,
      tagline: typeof rawCourseCard.tagline === "string" ? rawCourseCard.tagline : undefined,
    } : undefined,
  };
};

const toCategoryWithCourses = (category: CategoryRecord) => {
  const id = typeof category._id === "string" ? category._id : "";
  const name = typeof category.name === "string" ? category.name : "";
  const slug = typeof category.slug === "string" ? category.slug : "";

  if (!id || !name || !slug) {
    return null;
  }

  const courses = Array.isArray(category.courses)
    ? category.courses
        .map((course) => toCategoryCourse(course))
        .filter((course): course is NonNullable<ReturnType<typeof toCategoryCourse>> => course !== null)
    : [];

  return {
    _id: id,
    name,
    slug,
    order: typeof category.order === "number" ? category.order : undefined,
    courses,
  };
};

export async function GET() {
  try {
    const { apiKey } = await getResolvedConfig();
    if (!apiKey) {
      // If no key is set, return empty categories list so the UI falls back to hardcoded defaults
      return NextResponse.json({ success: true, categories: [] });
    }

    // 1. Fetch Categories
    const catQueryParams = new URLSearchParams({
      select: "name,slug,order",
      order: "asc",
    });

    const catRes = await fetchFromBackend("/categories", {
      queryParams: catQueryParams,
    });

    if (!catRes.ok) {
      console.error("Failed to fetch categories via proxy:", catRes.status, catRes.statusText);
      return NextResponse.json({ success: false, error: "Failed to fetch categories from backend" }, { status: catRes.status });
    }

    const catData = (await catRes.json()) as CategoriesResponse;
    const categories = catData.data || [];

    // 2. Fetch all Courses
    const courseQueryParams = new URLSearchParams({
      select: "courseCard,slug,course_title,order,category,course_name",
      limit: "1000",
    });

    const courseRes = await fetchFromBackend("/courses", {
      queryParams: courseQueryParams,
    });

    if (!courseRes.ok) {
      console.error("Failed to fetch courses via proxy:", courseRes.status, courseRes.statusText);
      return NextResponse.json({ success: true, categories: categories.map(cat => ({ ...cat, courses: [] })) });
    }

    const courseData = (await courseRes.json()) as CoursesResponse;
    const allCourses = courseData.data || [];

    // 3. Merge and Map Courses into Categories
    const categoriesWithCourses = categories.map((cat) => {
      const catCourses = allCourses.filter((course) => {
        const courseCategory = course.category;
        const courseCatRef = typeof courseCategory === "string"
          ? courseCategory
          : courseCategory?._id || courseCategory?.slug;
        return courseCatRef === cat._id || courseCatRef === cat.slug;
      });

      return {
        ...cat,
        courses: catCourses,
      };
    });

    // 4. Map, Sort and Filter Valid items
    const parsedCategories = categoriesWithCourses
      .map((category) => toCategoryWithCourses(category))
      .filter((category): category is NonNullable<ReturnType<typeof toCategoryWithCourses>> => category !== null)
      .sort((a, b) => getSortOrder(a.order) - getSortOrder(b.order))
      .map((cat) => ({
        ...cat,
        courses: [...(cat.courses || [])].sort((a, b) => getSortOrder(a.order) - getSortOrder(b.order)),
      }));

    return NextResponse.json({ success: true, categories: parsedCategories });
  } catch (error: any) {
    console.error("Failed to compile categories and courses:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
