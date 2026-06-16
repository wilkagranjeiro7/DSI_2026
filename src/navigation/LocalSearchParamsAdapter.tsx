import { useLocalSearchParams } from "expo-router";
import React, { ComponentType } from "react";

export type LocalSearchParams = Record<string, string | string[] | undefined>;

export interface LocalSearchParamsProps {
  params: LocalSearchParams;
}

export class LocalSearchParamReader {
  constructor(private readonly params: LocalSearchParams) {}

  get(key: string, fallback = ""): string {
    const value = this.params[key];

    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }

    return value ?? fallback;
  }

  isTrue(key: string): boolean {
    return this.get(key) === "true";
  }
}

class LocalSearchParamsAdapter {
  static connect<P extends LocalSearchParamsProps>(
    Screen: ComponentType<P>,
  ): ComponentType<Omit<P, keyof LocalSearchParamsProps>> {
    return function LocalSearchParamsBoundary(
      props: Omit<P, keyof LocalSearchParamsProps>,
    ) {
      const params = useLocalSearchParams();

      return <Screen {...(props as P)} params={params as LocalSearchParams} />;
    };
  }
}

export default LocalSearchParamsAdapter;
