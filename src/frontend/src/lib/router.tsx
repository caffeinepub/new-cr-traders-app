/**
 * Minimal react-router-dom compatible router using History API
 * Provides: BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams
 */
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface RouterCtx {
  pathname: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterCtx>({
  pathname: "/",
  navigate: () => {},
});

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    if (opts?.replace) window.history.replaceState(null, "", to);
    else window.history.pushState(null, "", to);
    setPathname(window.location.pathname);
  }, []);

  const ctx = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);

  return (
    <RouterContext.Provider value={ctx}>{children}</RouterContext.Provider>
  );
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

interface RoutesProps {
  children: ReactNode;
}

function matchPath(
  pattern: string,
  pathname: string,
): Record<string, string> | null {
  if (pattern === "*") return {};
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    const pt = pathParts[i];
    if (pp.startsWith(":")) {
      params[pp.slice(1)] = decodeURIComponent(pt);
    } else if (pp !== pt) {
      return null;
    }
  }
  return params;
}

const ParamsContext = createContext<Record<string, string>>({});

export function Routes({ children }: RoutesProps) {
  const { pathname } = useContext(RouterContext);

  let matched: ReactNode = null;
  const items = Array.isArray(children) ? children : [children];

  for (const child of items) {
    if (!child || typeof child !== "object" || !("props" in child)) continue;
    const { path, element } = (child as { props: RouteProps }).props;
    const params = matchPath(path, pathname);
    if (params !== null) {
      matched = (
        <ParamsContext.Provider value={params}>
          {element}
        </ParamsContext.Provider>
      );
      break;
    }
  }

  return <>{matched}</>;
}

export function Route(_props: RouteProps) {
  return null;
}

export function Navigate({
  to,
  replace,
}: {
  to: string;
  replace?: boolean;
}) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to, { replace });
  });
  return null;
}

export function Link({
  to,
  children,
  className,
  "data-ocid": ocid,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  "data-ocid"?: string;
}) {
  const { navigate } = useContext(RouterContext);
  return (
    <a
      href={to}
      className={className}
      data-ocid={ocid}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return (to: string | number, opts?: { replace?: boolean }) => {
    if (typeof to === "number") {
      window.history.go(to);
    } else {
      navigate(to, opts);
    }
  };
}

export function useParams<T extends Record<string, string>>(): T {
  return useContext(ParamsContext) as T;
}

export function useLocation() {
  const { pathname } = useContext(RouterContext);
  return { pathname };
}
