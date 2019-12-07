import { inject, injectable } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import * as ESTree from 'estree';

import { TNodeWithLexicalScope } from '../../types/node/TNodeWithLexicalScope';

import { IIdentifierNamesGenerator } from '../../interfaces/generators/identifier-names-generators/IIdentifierNamesGenerator';
import { IOptions } from '../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../interfaces/utils/IRandomGenerator';

@injectable()
export abstract class AbstractIdentifierNamesGenerator implements IIdentifierNamesGenerator {
    /**
     * @type {IOptions}
     */
    protected readonly options: IOptions;

    /**
     * @type {IRandomGenerator}
     */
    protected readonly randomGenerator: IRandomGenerator;

    /**
     * @type {Array}
     */
    protected readonly preservedNames: string[] = [];

    /**
     * @param {IRandomGenerator} randomGenerator
     * @param {IOptions} options
     */
    constructor (
        @inject(ServiceIdentifiers.IRandomGenerator) randomGenerator: IRandomGenerator,
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        this.randomGenerator = randomGenerator;
        this.options = options;
    }

    /**
     * @param {number} nameLength
     * @returns {string}
     */
    public abstract generate (nameLength?: number): string;

    /**
     * @param {number} nameLength
     * @returns {string}
     */
    public abstract generateWithPrefix (nameLength?: number): string;

    /**
     * @param {Identifier} identifierNode
     * @param {TNodeWithLexicalScope} blockScopeNode
     * @returns {string}
     */
    public abstract generateForBlockScope (identifierNode: ESTree.Identifier, blockScopeNode: TNodeWithLexicalScope): string;

    /**
     * @param {string} name
     * @returns {void}
     */
    public preserveName (name: string): void {
        this.preservedNames.push(name);
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    public isValidIdentifierName (name: string): boolean {
        return this.notReservedName(name) && !this.preservedNames.includes(name);
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    private notReservedName (name: string): boolean {
        return this.options.reservedNames.length
            ? !this.options.reservedNames.some((reservedName: string) =>
                new RegExp(reservedName, 'g').exec(name) !== null
            )
            : true;

    }
}
